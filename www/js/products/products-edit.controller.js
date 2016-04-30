/**
 * Created by weiluo on 4/28/16.
 */

angular.module('emiratesApp')
  .controller('ProductsEditCtrl', function (FirebaseUrl, $stateParams, $scope, $ionicActionSheet, $ionicPopup,
                                            $ionicHistory, departments, product, auth, $cordovaCamera) {

    var productsEditCtrl = this;
    var editProduct = product ? true : false;

    productsEditCtrl.product = product;
    productsEditCtrl.departments = departments;


    productsEditCtrl.getNumber = function (count) {
      return new Array(count);
    };


    productsEditCtrl.showDeleteImageAction = function (index) {
      $ionicActionSheet.show({
        titleText: 'Delete product picture',
        destructiveText: 'Delete',
        cancelText: 'Cancel',
        destructiveButtonClicked: function () {
          productsEditCtrl.product.pictures.splice(index, 1);
          return true;
        }
      })
    };


    productsEditCtrl.sourceType = 1;

    productsEditCtrl.showCameraAction = function () {
      $ionicActionSheet.show({
        titleText: 'Please select photo source',
        buttons: [
          {text: 'Camera'},
          {text: 'Photo Album'}
        ],
        cancelText: 'Cancel',
        buttonClicked: function (index) {
          productsEditCtrl.sourceType = 1 - index;
          productsEditCtrl.addPicture();
          return true;
        }
      })
    };

    productsEditCtrl.addPicture = function () {
      var options = {
        quality: 100,
        destinationType: navigator.camera.DestinationType.DATA_URL,
        targetWidth: 500,
        targetHeight: 500,
        sourceType: $scope.sourceType,
        allowEdit: true
      };
      $cordovaCamera.getPicture(options).then(function (imageData) {
        if (productsEditCtrl.product.pictures) {
          productsEditCtrl.product.pictures.push('data:image/jpeg;base64,' + imageData);
        } else {
          productsEditCtrl.product.pictures = ['data:image/jpeg;base64,' + imageData];
        }
        $ionicSlideBoxDelegate.update();
      }, function (err) {
        //console.err(err);
      });
    };

    productsEditCtrl.saveSuccessAlert = function () {
      //$ionicLoading.hide();
      $ionicPopup.alert({
        title: 'Success',
        template: 'Your product has been saved.',
        okText: 'OK',
        okType: 'button-assertive'
      }).then(function() {
        $ionicHistory.goBack();
      });
    };

    productsEditCtrl.save = function () {
      productsEditCtrl.product.sku = Math.floor((Math.random() * 4897705) + 1000000);
      productsEditCtrl.product.publisher = auth.uid;
      if (editProduct) {
        productsEditCtrl.product.$save().then(productsEditCtrl.saveSuccessAlert());
      } else {
        var ref = new Firebase(FirebaseUrl + 'products');
        ref.push(productsEditCtrl.product, productsEditCtrl.saveSuccessAlert());
      }
      //$ionicLoading.show({
      //  template: '<ion-spinner>Saving...</ion-spinner>'
      //});
    };

    productsEditCtrl.cancel = function() {
      $ionicPopup.confirm({
        title: 'Cancel',
        template: 'Are you sure you want to cancel editing?',
        okText: 'Yes',
        okType: 'button-assertive',
        cancelText: 'No',
        cancelType: 'button-assertive button-outline'
      }).then(function(res) {
        if (res) {
          $ionicHistory.goBack();
        }
      })
    }
  });
