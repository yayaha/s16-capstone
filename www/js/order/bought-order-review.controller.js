/**
 * Created by weiluo on 4/25/16.
 */
angular.module('emiratesApp')
  .controller('BoughtOrderReviewCtrl', function(auth, TaxRate, currentOrder) {
    var boughtOrderReviewCtrl = this;

    boughtOrderReviewCtrl.currentOrder = currentOrder;

    boughtOrderReviewCtrl.rawPrice = function () {
      var total = 0;
      angular.forEach(boughtOrderReviewCtrl.currentOrder.cart, function (value, key) {
        total += value.price * value.quantity;
      });
      return total;
    };

    boughtOrderReviewCtrl.tax = function () {
      return boughtOrderReviewCtrl.rawPrice() * TaxRate;
    };

    // TODO shipping fee
    boughtOrderReviewCtrl.shippingFee = function () {
      return 1000;
    };

    boughtOrderReviewCtrl.totalPrice = function () {
      return boughtOrderReviewCtrl.rawPrice() + boughtOrderReviewCtrl.shippingFee() + boughtOrderReviewCtrl.tax();
    };


  });
