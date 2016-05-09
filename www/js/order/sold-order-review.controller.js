/**
 * Created by weiluo on 4/26/16.
 */

angular.module('emiratesApp')
  .controller('SoldOrderReviewCtrl', function(FirebaseUrl, $scope, auth, TaxRate, currentOrder, OrderStatusEnum, $ionicPopup) {
    var soldOrderReviewCtrl = this;

    soldOrderReviewCtrl.currentOrder = currentOrder;

    soldOrderReviewCtrl.rawPrice = function () {
      var total = 0;
      angular.forEach(soldOrderReviewCtrl.currentOrder.cart, function (value, key) {
        total += value.price * value.quantity;
      });
      return total;
    };

    soldOrderReviewCtrl.tax = function () {
      return soldOrderReviewCtrl.rawPrice() * TaxRate;
    };

    // TODO shipping fee
    soldOrderReviewCtrl.shippingFee = function () {
      return 1000;
    };

    soldOrderReviewCtrl.totalPrice = function () {
      return soldOrderReviewCtrl.rawPrice() + soldOrderReviewCtrl.shippingFee() + soldOrderReviewCtrl.tax();
    };

    // TODO not implemented yet
    soldOrderReviewCtrl.ship = function() {
      $ionicPopup.show({
        title: 'Enter shipment information',
        scope: $scope,
        template:
          '<div class="list">' +
          '<label class="item item-input item-select">' +
          '<div class="input-label">Carrier</div>' +
          '<select ng-model="soldOrderReviewCtrl.shippingCarrier">' +
          '<option disabled selected value="">---Choose carrier---</option>' +
          '<option value="USPS">USPS</option><option value="FedEx">FedEx</option>' +
          '<option value="DHL">DHL</option><option value="UPS">UPS</option>' +
          '</select>' +
          '</label>' +
          '<label class="item item-input">' +
          '<input placeholder="Tracking Number" ng-model="soldOrderReviewCtrl.shippingTrackingNumber">' +
          '</label>' +
          '</div>',
        buttons: [
          {text: 'Cancel'},
          {
            text: 'Enter',
            type: 'button-assertive',
            onTap: function(e) {
              if (!(soldOrderReviewCtrl.shippingCarrier && soldOrderReviewCtrl.shippingTrackingNumber)) {
                e.preventDefault();
              } else {
                soldOrderReviewCtrl.saveShipmentInformation();
              }
            }
          }
        ]
      })
    };

    soldOrderReviewCtrl.saveShipmentInformation = function() {
      var orderRef = new Firebase(FirebaseUrl + 'orders/' + soldOrderReviewCtrl.currentOrder.$id);
      var data = {
        shippingTimestamp: Firebase.ServerValue.TIMESTAMP,
        shippingCarrier: soldOrderReviewCtrl.shippingCarrier,
        trackingNumber: soldOrderReviewCtrl.shippingTrackingNumber,
        status: OrderStatusEnum.SHIPPED
      };
      orderRef.update(data, function() {
        $ionicPopup.alert({
          title: 'Success',
          template: 'Shipping information updated!',
          okText: 'OK',
          okType: 'button-assertive'
        });
      });
    };

    // TODO not implemented yet
    soldOrderReviewCtrl.cancelOrder = function() {
      if (currentOrder.status != OrderStatusEnum.PENDING) {
        $ionicPopup.alert({
          title: 'Error',
          template: 'You can\'t cancel a order that\'s already shipped/completed',
          okText: 'OK',
          okType: 'button-assertive'
        });
      } else {
        $ionicPopup.confirm({
          title: 'Cancel Order',
          template: 'Are you sure you want to cancel this order?',
          okText: 'Yes',
          okType: 'button-assertive',
          cancelText: 'No',
          cancelType: 'button-assertive button-outline'
        })
      }
    };


  });
