/**
 * Created by weiluo on 4/25/16.
 */

angular.module('emiratesApp')
  .controller('BoughtOrderCtrl', function($scope, auth, orders) {
    var boughtOrderCtrl = this;

    boughtOrderCtrl.orders = orders;

  });
