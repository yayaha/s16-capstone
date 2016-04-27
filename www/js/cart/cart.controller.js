/**
 * Created by weiluo on 3/13/16.
 */

angular.module('emiratesApp')
  .controller('CartCtrl', function (FirebaseUrl, $state, $ionicPopup, $ionicHistory, $ionicLoading,
                                    $firebaseObject, auth, Cart, Auth, Profile, TaxRate, Order) {
    var cartCtrl = this;

    cartCtrl.taxRate = TaxRate;

    Auth.auth.$onAuth(function (authData) {
      if (authData) {
        Cart.cart(authData.uid).$loaded().then(function (data) {
          cartCtrl.cart = data;
        });
        Profile.getProfile(authData.uid).$loaded().then(function (data) {
          cartCtrl.profile = data;
          if (data.shippingInfo) {
            cartCtrl.shippingInfo = data.shippingInfo;
          } else {
            cartCtrl.shippingInfo = {};
            cartCtrl.shippingInfo.firstname = data.firstname;
            cartCtrl.shippingInfo.lastname = data.lastname;
            cartCtrl.shippingInfo.addr = data.addr;
            cartCtrl.shippingInfo.number = data.number;
          }
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

    cartCtrl.reviewOrder = function () {
      cartCtrl.profile.shippingInfo = cartCtrl.shippingInfo;
      cartCtrl.profile.$save().then(function () {
        $ionicLoading.hide();
        $state.go('tab.review-order')
      });
      $ionicLoading.show({
        template: '<ion-spinner>Loading...</ion-spinner>'
      });
    };

    cartCtrl.removeProduct = function (cartProductId) {
      Cart.removeProduct(auth.uid, cartProductId);
    };

    cartCtrl.removeAll = function () {
      Cart.removeProduct(auth.uid);
    };

    cartCtrl.rawPrice = function () {
      var total = 0;
      angular.forEach(cartCtrl.cart, function (value, key) {
        total += value.price * value.quantity;
      });
      return total;
    };

    cartCtrl.tax = function () {
      return cartCtrl.rawPrice() * TaxRate;
    };

    // TODO shipping fee
    cartCtrl.shippingFee = function () {
      return 1000;
    };

    cartCtrl.totalPrice = function () {
      return cartCtrl.rawPrice() + cartCtrl.shippingFee() + cartCtrl.tax();
    };

    cartCtrl.placeOrder = function () {
      // Check account balance first.
      if (cartCtrl.profile.balance.available < cartCtrl.totalPrice()) {
        $ionicPopup.alert({
          title: 'Insufficient balance',
          template: 'Your account doesn\'t have enough balance for this order! Placing order failed.',
          okText: 'OK',
          okType: 'button-assertive'
        });
        return;
      }
      Order.placeOrder(auth.uid, cartCtrl.cart, cartCtrl.shippingInfo);
      cartCtrl.profile.balance.available -= cartCtrl.totalPrice();
      cartCtrl.profile.$save();
      $ionicPopup.alert({
        title: 'Successful',
        template: 'Your order has been placed!',
        okText: 'Got it',
        okType: 'button-assertive'
      }).then(function () {
        var tmpCart = $firebaseObject(new Firebase(FirebaseUrl + 'cart/' + auth.uid));
        tmpCart.$remove();
        $state.go('tab.departments').then(function () {
          $ionicHistory.clearHistory();
        });

      });

    }


  });
