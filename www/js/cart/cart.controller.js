/**
 * Created by weiluo on 3/13/16.
 */

angular.module('emiratesApp')
  .controller('CartCtrl', function(auth, Cart, Auth) {
    var cartCtrl = this;

    if (!auth) {
      return;
    }

    Auth.auth.$onAuth(function(authData) {
      if (authData) {
        Cart.cart(authData.uid).$loaded().then(function(data) {
          cartCtrl.cart = data;
        })
      } else {
        cartCtrl.cart = [];
      }
    });

    cartCtrl.removeProduct = function(cartProductId) {
      Cart.removeProduct(authAndProduct.auth.uid, cartProductId);
    };

  });
