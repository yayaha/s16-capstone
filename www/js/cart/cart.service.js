/**
 * Created by weiluo on 3/13/16.
 */
angular.module('emiratesApp')
  .factory('Cart', function (FirebaseUrl, $firebaseArray, Shop) {

    var cartRef = new Firebase(FirebaseUrl + 'cart');

    //var cartArr = null;

    var getCartByUid = function (uid) {
      return $firebaseArray(cartRef.child(uid));
    };


    var addProductToCartArray = function (uid, cartArr, productId, quantity) {
      var existingEntry = cartArr.$getRecord(productId);
          // If product already exists in cart.
          if (existingEntry != null) {
            existingEntry.quantity += quantity;
            cartArr.$save(existingEntry);
          } else {
            Shop.getProduct(productId).$loaded().then(function (product) {

              var data = {
                'productId': productId,
                'quantity': quantity,
                'name': product.name,
                'price': product.price,
                'publisher': product.publisher
              };
              if (product.pictures) {
                data.picture = product.pictures[0];
              } else {
                data.picture = 'img/default_product.png';
              }
              cartRef.child(uid).child(productId).set(data);
            });
          }
    };

    return {


      cart: getCartByUid,

      addProduct: function (uid, departmentId, productId, quantity) {
        getCartByUid(uid).$loaded().then(function(cartArr) {
          addProductToCartArray(uid, cartArr, departmentId, productId, quantity);
        });
      },

      removeProduct: function (uid, cartProductId) {
        getCartByUid(uid).$loaded(function(cartArr) {
          cartArr.$remove(cartProductId)
        });
      }
    }

  });
