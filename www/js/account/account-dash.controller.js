/**
 * Created by weiluo on 3/10/16.
 */

angular.module('emiratesApp')
  .controller('AccountDashCtrl', function($state, Auth, auth, profile){
    var acctCtrl = this;
    acctCtrl.profile = profile;

    acctCtrl.logout = function() {
      Auth.$unauth();
      $state.go('tab.home');
    }
  });
