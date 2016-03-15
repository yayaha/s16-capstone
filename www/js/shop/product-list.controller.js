/**
 * Created by weiluo on 3/11/16.
 */

angular.module('emiratesApp')
  .controller('ProductListCtrl', function(productList, departmentName, $stateParams) {
    var productListCtrl = this;

    productListCtrl.productList = productList;

    productListCtrl.departmentName = departmentName;

    productListCtrl.departmentId = $stateParams.departmentId;
  });
