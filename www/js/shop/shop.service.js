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
        return departments.$loaded().then(function(x){
          return x.$getRecord(departmentId);
        });
      },

      getProductWithinDepartment: function(productId) {
        return products.$loaded().then(function(x) {
          return x.$getRecord(productId)
        });
      },

      getProduct: function(departmentId, productId) {
        return $firebaseArray(productListRef.child(departmentId)).$loaded().then(function(x){
          return x.$getRecord(productId);
        })
      },

      all: function() {
        return departments;
      }
    }

  });
