/**
 * Created by weiluo on 3/10/16.
 */

angular
  .module('emiratesApp')
  .controller('AuthCtrl', function (Auth, $state, $ionicPopup) {
    var authCtrl = this;

    authCtrl.user = {
      email: '',
      password: ''
    };

    authCtrl.login = function (nextPage) {
      Auth.login(authCtrl.user).then(function () {
        authCtrl.user = {
          email: '',
          password: ''
        };
        $state.go(nextPage);
      }, function (error) {
        authCtrl.showAlert('Error', error.message);
      })
    };

    authCtrl.register = function () {
      Auth.register(authCtrl.user).then(function () {
        authCtrl.showAlert('Register successful!', 'Your account was created!');
        authCtrl.login('tab.edit-profile');
      }, function (error) {
        authCtrl.showAlert('Error', error.message);
      })
    };

    authCtrl.showAlert = function (title, msg) {
      $ionicPopup.alert({
        title: title,
        template: msg,
        okType: 'button-assertive'
      })
    }
  });
