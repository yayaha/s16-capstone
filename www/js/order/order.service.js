/**
 * Created by weiluo on 4/23/16.
 */
angular.module('emiratesApp')
  .factory('Order', function(FirebaseUrl, OrderStatusEnum, $firebaseArray, $firebaseObject, $ionicPopup) {


    var fbRef = new Firebase(FirebaseUrl);

    var deductInventory = function(item) {
      $firebaseObject(fbRef.child('products/' + item.departmentId + '/' + item.productId)).$loaded().then(function(data) {
        data.inventory -= item.quantity;
        data.$save();
      });
    };



    return {
      placeOrder: function(uid, cartArr, shippingInfo) {
        // Divide items in cart by different sellers.
        var cartBySeller = {};
        var totalBySeller = {};
        for (var i = 0; i < cartArr.length; i++) {
          var item = cartArr[i];
          deductInventory(item);
          if (cartBySeller.hasOwnProperty(item.publisher)) {
            totalBySeller[item.publisher] += item.price * item.quantity;
            cartBySeller[item.publisher].push(item);
          } else {
            totalBySeller[item.publisher] = item.price * item.quantity;
            cartBySeller[item.publisher] = [item];
          }
        }

        // Generate orders for items with each different seller.
        var orders = $firebaseArray(fbRef.child('orders/' + uid));
        var buyerOrders = $firebaseArray(fbRef.child('buyerOrders/' + uid));
        var orderDetails = {};
        orderDetails.buyerId = uid;
        orderDetails.shippingInfo = shippingInfo;
        orderDetails.orderTimestamp = Firebase.ServerValue.TIMESTAMP;
        orderDetails.status = OrderStatusEnum.PENDING;
        // WARNING: hard-coded order number.
        orderDetails.orderNumber = Firebase.ServerValue.TIMESTAMP;//Math.floor((Math.random() * 10000000) + 12345678);
        for (var sellerId in cartBySeller) {
          // If this should be an order with a single seller
          if (cartBySeller.hasOwnProperty(sellerId)) {
            orderDetails.sellerId = sellerId;
            orderDetails.cart = cartBySeller[sellerId];
            // Add the order details to database, after adding it, update buyer's and seller's database entries so that
            // both buyer and seller have the database key of this order.
            orders.$add(orderDetails).then(function(ref) {
              buyerOrders.$add(ref.key());
              var orderObj = $firebaseObject(ref);
              orderObj.$loaded().then(function() {
                var sellerOrders = $firebaseArray(fbRef.child('sellerOrders/' + orderObj.sellerId));
                sellerOrders.$add(ref.key());
              })
            });

            // Add pending balance to seller account
            $firebaseObject(fbRef.child('users/' + sellerId)).$loaded().then(function(data) {
              data.balance.pending += totalBySeller[data.$id];
              data.$save();
            });
          }
        }

      },

      getBuyerOrders: function(uid) {
        return $firebaseArray(fbRef.child('orders/' + uid));
      }
    }

  });
