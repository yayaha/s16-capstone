/**
 * Created by weiluo on 4/25/16.
 */
angular.module('emiratesApp')
  .controller('BoughtOrderReviewCtrl', function(FirebaseUrl, auth, TaxRate, currentOrder, OrderStatusEnum, $ionicPopup, $firebaseObject) {

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


    boughtOrderReviewCtrl.confirmReceipt = function() {
      if (currentOrder.status == OrderStatusEnum.PENDING) {
        $ionicPopup.alert({
          title: 'Error',
          template: 'Your order has not been shipped yet.',
          okText: 'OK',
          okType: 'button-assertive'
        });
      } else {
        $ionicPopup.confirm({
          title: 'Confirm Order Receipt',
          template: 'Are you sure you have received your order? Confirming receipt will complete this order.',
          okText: 'Confirm',
          okType: 'button-assertive'
        }).then(function(res) {
          if (res) {
            var orderRef = new Firebase(FirebaseUrl + 'orders/' + boughtOrderReviewCtrl.currentOrder.$id);
            orderRef.update({status: OrderStatusEnum.COMPLETE});
            var sellerRef = new Firebase(FirebaseUrl + 'users/' + boughtOrderReviewCtrl.currentOrder.sellerId);
            $firebaseObject(sellerRef).$loaded().then(function(data) {
              data.balance.available += (boughtOrderReviewCtrl.rawPrice() + boughtOrderReviewCtrl.shippingFee());
              data.balance.pending -= (boughtOrderReviewCtrl.rawPrice() + boughtOrderReviewCtrl.shippingFee());
              data.$save();
            });
            $ionicPopup.alert({
              title: 'Complete',
              template: 'Your order is now completed!',
              okText: 'OK',
              okType: 'button-assertive'
            });
          }
        })
      }
    };

    // TODO not implemented yet
    boughtOrderReviewCtrl.trackShipment = function() {
      $ionicPopup.alert({
        title: 'Aha',
        template: 'This functionality is yet to be implemented.',
        okText: 'OK, I\'ll wait',
        okType: 'button-assertive'
      })
    }


  });
