/**
 * Created by weiluo on 3/12/16.
 */

angular.module('emiratesApp')
  .controller('ProductCtrl', function(product) {
    var productCtrl = this;
    productCtrl.product = product;

    if (productCtrl.product.pictures) {
      productCtrl.productPictures = productCtrl.product.pictures;
    } else {
      productCtrl.productPictures = ["img/default_product.png"];
    }

    productCtrl.getNumber = function(num) {
      return new Array(num);
    };

  });
