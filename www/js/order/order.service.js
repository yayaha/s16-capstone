/**
 * Created by weiluo on 4/23/16.
 */
angular.module('emiratesApp')
  .factory('Order', function(FirebaseUrl, OrderStatusEnum, $firebaseArray, $firebaseObject, $ionicPopup) {


    var fbRef = new Firebase(FirebaseUrl);

    var deductInventory = function(item) {
      $firebaseObject(fbRef.child('products/' + item.productId)).$loaded().then(function(data) {
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
        var orders = $firebaseArray(fbRef.child('orders/'));
        //var buyerOrders = $firebaseArray(fbRef.child('buyerOrders/' + uid));
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
            // Concatenate products names to generate display name on order management page.
            orderDetails.displayName = '';
            for (var j = 0; j < orderDetails.cart.length; j++) {
              if (j > 0) {
                orderDetails.displayName += ', ';
              }
              orderDetails.displayName += orderDetails.cart[j].name;
            }
            // Add the order details to database, after adding it, update buyer's and seller's database entries so that
            // both buyer and seller have the database key of this order.
            orders.$add(orderDetails);
            //  .then(function(ref) {
            //  buyerOrders.$add(ref.key());
            //  var orderObj = $firebaseObject(ref);
            //  orderObj.$loaded().then(function() {
            //    var sellerOrders = $firebaseArray(fbRef.child('sellerOrders/' + orderObj.sellerId));
            //    sellerOrders.$add(ref.key());
            //  })
            //});

            // Add pending balance to seller account
            $firebaseObject(fbRef.child('users/' + sellerId)).$loaded().then(function(data) {
              data.balance.pending += totalBySeller[data.$id];
              data.$save();
            });
          }
        }

      },

      getBuyerOrders: function(uid) {
        return $firebaseArray(fbRef.child('orders').orderByChild('buyerId').equalTo(uid));

        //return $firebaseArray(fbRef.child('buyerOrders/' + uid)).$loaded().then(function(data) {
        //  for (var i = 0; i < data.length; i++) {
        //
        //  }
        //});
        //var obj = new Firebase.util.NormalizedCollection(
        //  [fbRef.child("/buyerOrders/" + uid), "buyerOrders"],
        //  [fbRef.child("/orders"), "allOrders", "buyerOrders.$value"]
        //).select(
        //  {"key":"buyerOrders.$value","alias":"orderKey"},
        //  {"key":"allOrders.$value","alias":"orderDetails"}
        //).ref();
        //var res = $firebaseArray(obj);
        //return res;
      },

      getSellerOrders: function(uid) {
        return $firebaseArray(fbRef.child('orders').orderByChild('sellerId').equalTo(uid));
      }
    }

  });
