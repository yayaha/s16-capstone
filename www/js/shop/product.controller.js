/**
 * Created by weiluo on 3/12/16.
 */

angular.module('emiratesApp')
  .controller('ProductCtrl', function($stateParams, $ionicPopup, $state, product, Auth, Cart) {
    var productCtrl = this;
    productCtrl.product = product;

    if (productCtrl.product.pictures) {
      productCtrl.productPictures = productCtrl.product.pictures;
    } else {
      productCtrl.productPictures = ["img/default_product.png"];
    }

    productCtrl.options = [];
    for (var i = 1; i <= productCtrl.product.inventory; i++) {
      productCtrl.options.push(i);
    }


    productCtrl.getNumber = function(num) {
      return new Array(num);
    };

    productCtrl.addToCart = function() {
      return Auth.auth.$requireAuth().then(function(auth) {
        Cart.addProduct(auth.uid, $stateParams.productId, productCtrl.quantity);
        $ionicPopup.alert({
          template: 'Product added to your cart!',
          okType: 'button-assertive'
        });
      }, function() {
        $ionicPopup.alert({
          title: 'Failed',
          template: 'You must log in to add products to cart.',
          okType: 'button-assertive'
        })
      })
    };

    productCtrl.buyItNow = function() {
      return Auth.auth.$requireAuth().then(function(auth) {
        Cart.addProduct(auth.uid, $stateParams.productId, productCtrl.quantity);
        $ionicPopup.alert({
          template: 'Product added to your cart!',
          okType: 'button-assertive'
        }).then(function() {
          $state.go('tab.cart')
        });
      }, function() {
        $ionicPopup.alert({
          title: 'Failed',
          template: 'You must log in to add products to cart.',
          okType: 'button-assertive'
        })
      })
    }

  });
