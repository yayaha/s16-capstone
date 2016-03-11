/**
 * Created by weiluo on 3/10/16.
 */


angular.module('emiratesApp')
  .factory('Auth', function($firebaseAuth, FirebaseUrl) {
    var ref = new Firebase(FirebaseUrl);
    var auth = $firebaseAuth(ref);

    return auth;
  });
