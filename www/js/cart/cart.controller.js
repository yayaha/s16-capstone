/**
 * Created by weiluo on 3/13/16.
 */

angular.module('emiratesApp')
  .controller('CartCtrl', function ($state, $ionicPopup, $ionicHistory, auth, Cart, Auth, Profile, TaxRate) {
    var cartCtrl = this;

    cartCtrl.taxRate = TaxRate;

    Auth.auth.$onAuth(function (authData) {
      if (authData) {
        Cart.cart(authData.uid).$loaded().then(function (data) {
          cartCtrl.cart = data;
        });
        Profile.getProfile(authData.uid).$loaded().then(function (data) {
          cartCtrl.profile = data;
          cartCtrl.shippingInfo = {};
          cartCtrl.shippingInfo.firstname = data.firstname;
          cartCtrl.shippingInfo.lastname = data.lastname;
          cartCtrl.shippingInfo.addr = data.addr;
          cartCtrl.shippingInfo.number = data.number;
        });
      } else {
        cartCtrl.cart = null;
        cartCtrl.profile = null;
        cartCtrl.shippingInfo = null;
      }
    });

    if (!auth) {
      return;
    }

    cartCtrl.removeProduct = function (cartProductId) {
      Cart.removeProduct(auth.uid, cartProductId);
    };

    cartCtrl.removeAll = function () {
      Cart.removeProduct(auth.uid);
    };

    cartCtrl.rawPrice = function() {
      var total = 0;
      angular.forEach(cartCtrl.cart, function(value, key) {
        total += value.price * value.quantity;
      });
      return total;
    };

    cartCtrl.tax = function() {
      return cartCtrl.rawPrice() * TaxRate;
    };

    // TODO shipping fee
    cartCtrl.shippingFee = function() {
      return 1000;
    };

    cartCtrl.placeOrder = function() {
      $ionicPopup.alert({
        title: 'Successful',
        template: 'Your order has been placed!',
        okText: 'Got it',
        okType: 'button-assertive'
      }).then(function() {
        $state.go('tab.departments').then(function() {
          $ionicHistory.clearHistory();
        });

      });

    }


  });
