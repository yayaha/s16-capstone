/**
 * Created by weiluo on 3/11/16.
 */

angular.module('emiratesApp')
  .factory('Shop', function($firebaseArray, FirebaseUrl) {

    var departmentsRef = new Firebase(FirebaseUrl + 'departments');
    var productListRef = new Firebase(FirebaseUrl + 'products');
    var departments = $firebaseArray(departmentsRef);


    return {
      getProductList: function(departmentId) {
        return $firebaseArray(productListRef.child(departmentId));
      },

      getDepartment: function(departmentId) {
        return departments[departmentId];
      },

      all: function() {
        return departments;
      }
    }

  });
