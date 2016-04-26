/**
 * Created by weiluo on 3/10/16.
 */

angular.module('emiratesApp')
  .controller('AccountDashCtrl', function($scope, $state, Auth, auth, profile){
    var acctCtrl = this;

      acctCtrl.profile = profile;


    acctCtrl.logout = function() {
      Auth.logout();
    }
  });
