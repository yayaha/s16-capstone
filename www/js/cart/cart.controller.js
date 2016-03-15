/**
 * Created by weiluo on 3/13/16.
 */

angular.module('emiratesApp')
  .controller('CartCtrl', function(auth, cart, Cart) {
    var cartCtrl = this;

    cartCtrl.cart = cart;

    cartCtrl.removeProduct = function(cartProductId) {
      Cart.removeProduct(auth.uid, cartProductId);
    }


  });
