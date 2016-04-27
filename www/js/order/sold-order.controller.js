/**
 * Created by weiluo on 4/26/16.
 */

angular.module('emiratesApp')
  .controller('SoldOrderCtrl', function(auth, orders) {
    var soldOrderCtrl = this;

    soldOrderCtrl.orders = orders;

  });
