/**
 * Created by weiluo on 3/10/16.
 */


angular.module('emiratesApp')
  .factory('Auth', function ($firebaseAuth, FirebaseUrl, $state) {
    var ref = new Firebase(FirebaseUrl);
    var auth = $firebaseAuth(ref);

    var currentUserData = null;

    return {
      auth: auth,

      login: function (user, nextPage) {
        return auth.$authWithPassword(user).then(function (auth) {
          console.log('Login successful!');
          currentUserData = auth;
          $state.go(nextPage);
        }, function (error) {
          currentUserData = null;
        });
      },

      register: function(user){
        return auth.$createUser(user);
      },

      logout: function() {
        auth.$unauth();
        currentUserData = null;
        $state.go('tab.departments');
      },

      currentUserData: currentUserData
    }
  });
