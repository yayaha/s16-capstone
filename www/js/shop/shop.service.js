/**
 * Created by weiluo on 3/11/16.
 */

angular.module('emiratesApp')
  .factory('Shop', function($firebaseArray, $firebaseObject, FirebaseUrl) {

    var departmentsRef = new Firebase(FirebaseUrl + 'departments');
    var productListRef = new Firebase(FirebaseUrl + 'products');
    var departments = $firebaseArray(departmentsRef);

    return {
      getProductList: function(departmentId) {
        return $firebaseArray(productListRef.orderByChild('departmentId').equalTo(departmentId));
      },

      getDepartment: function(departmentId) {
        return departments.$loaded().then(function(x){
          var obj = x.$getRecord(departmentId);
          return obj;
        });
      },

      getProduct: function(productId) {
        return $firebaseObject(productListRef.child(productId));
      },

      all: function() {
        return departments;
      }
    }

  });
