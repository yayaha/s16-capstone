/**
 * Created by weiluo on 4/28/16.
 */

angular.module('emiratesApp')
  .controller('ProductsManagementCtrl', function(auth, products, ProductsManagement) {

    var productsManagementCtrl = this;

    productsManagementCtrl.activeProducts = [];
    productsManagementCtrl.soldoutProducts = [];

    for (var i = 0; i < products.length; i++) {
      if (products[i].inventory == 0) {
        productsManagementCtrl.soldoutProducts.push(products[i]);
      } else {
        productsManagementCtrl.activeProducts.push(products[i]);
      }
    }

    productsManagementCtrl.editProduct = function(productId) {
      ProductsManagement.editProduct(productId);
    }

  });
