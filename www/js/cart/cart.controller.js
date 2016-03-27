/**
 * Created by weiluo on 3/13/16.
 */

angular.module('emiratesApp')
  .controller('CartCtrl', function(auth, Cart, Auth) {
    var cartCtrl = this;

    Auth.auth.$onAuth(function(authData) {
      if (authData) {
        Cart.cart(authData.uid).$loaded().then(function(data) {
          cartCtrl.cart = data;
        })
      } else {
        cartCtrl.cart = [];
      }
    });

    if (!auth) {
      return;
    }

    cartCtrl.removeProduct = function(cartProductId) {
      Cart.removeProduct(auth.uid, cartProductId);
    };

  });
