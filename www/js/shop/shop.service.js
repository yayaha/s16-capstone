/**
 * Created by weiluo on 3/11/16.
 */

angular.module('emiratesApp')
  .factory('Shop', function($firebaseArray, FirebaseUrl) {

    var departmentsRef = new Firebase(FirebaseUrl + 'departments');
    var productListRef = new Firebase(FirebaseUrl + 'products');
    var departments = $firebaseArray(departmentsRef);

    var products;

    return {
      getProductList: function(departmentId) {
        products = $firebaseArray(productListRef.child(departmentId));
        return products;
      },

      getDepartment: function(departmentId) {
        return departments[departmentId];
      },

      getProductWithinDepartment: function(productId) {
        return products[productId];
      },

      all: function() {
        return departments;
      }
    }

  });
