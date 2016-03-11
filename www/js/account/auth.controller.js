/**
 * Created by weiluo on 3/10/16.
 */

angular
  .module('emiratesApp')
  .controller('AuthCtrl', function(Auth, $state, $ionicPopup) {
    var authCtrl = this;

    authCtrl.user = {
      email: '',
      password: ''
    };

    authCtrl.login = function(nextPage) {
      Auth.$authWithPassword(authCtrl.user).then(function(auth) {
        console.log('Login successful!');
        $state.go(nextPage);
      }, function(error) {
        authCtrl.showAlert('Error', error.message);
      });
    };

    authCtrl.register = function() {
      Auth.$createUser(authCtrl.user)
        .then(function(user) {
          authCtrl.showAlert('Register successful!', 'Your account was created!');
          authCtrl.login('tab.edit-profile');
        }, function(error) {
          authCtrl.showAlert('Error', error.message);
        })
    };

    authCtrl.showAlert = function(title, msg) {
      $ionicPopup.alert({
        title: title,
        template: msg,
        okType: 'button-assertive'
      })
    }
  });
