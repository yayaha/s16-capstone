/**
 * Created by weiluo on 3/10/16.
 */


angular.module('emiratesApp')
  .factory('Auth', function ($firebaseAuth, FirebaseUrl, $state, $ionicHistory) {
    var ref = new Firebase(FirebaseUrl);
    var auth = $firebaseAuth(ref);

    return {
      auth: auth,

      login: function (user) {
        return auth.$authWithPassword(user)
      },

      register: function(user){
        return auth.$createUser(user);
      },

      logout: function() {
        auth.$unauth();
        // Clear all data and view history
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $state.go('tab.departments');
      }

    }
  });
