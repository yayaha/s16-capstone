/**
 * Created by weiluo on 3/10/16.
 */

angular.module('emiratesApp')
  .factory('Profile', function($firebaseArray, $firebaseObject, FirebaseUrl) {
    var usersRef = new Firebase(FirebaseUrl + 'users');
    //var users = $firebaseArray(usersRef);

    var User = {
      getProfile: function(uid) {
        return $firebaseObject(usersRef.child(uid));
      },

      //all: users,

      getGravatar: function(emailHash) {
        return 'http://www.gravatar.com/avatar/' + emailHash;
      }
    };

    return User;
  });
