/**
 * Created by weiluo on 4/28/16.
 */
angular.module('emiratesApp')
  .factory('ProductsManagement', function($firebaseArray, $state, FirebaseUrl) {

    var fbRef = new Firebase(FirebaseUrl);

    return {
      getProductsForUser: function(uid) {
        return $firebaseArray(fbRef.child('products').orderByChild('publisher').equalTo(uid));
      },

      editProduct: function(productId) {
        $state.go('tab.edit-product', {productId: productId});
      }
    }

  });
