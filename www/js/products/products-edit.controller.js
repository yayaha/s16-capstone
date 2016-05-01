/**
 * Created by weiluo on 4/28/16.
 */

angular.module('emiratesApp')
  .controller('ProductsEditCtrl', function (FirebaseUrl, $stateParams, $scope, $ionicActionSheet, $ionicPopup,
                                            $ionicHistory, departments, product, auth, $cordovaCamera, Censor) {

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
        sourceType: productsEditCtrl.sourceType,
        allowEdit: true
      };
      $cordovaCamera.getPicture(options).then(function (imageData) {
        if (!productsEditCtrl.product) {
          productsEditCtrl.product = {};
        }
        if (productsEditCtrl.product.pictures) {
          productsEditCtrl.product.pictures.push('data:image/jpeg;base64,' + imageData);
        } else {
          productsEditCtrl.product.pictures = ['data:image/jpeg;base64,' + imageData];
        }
      }, function (err) {
        $ionicPopup.alert({
          title: 'Error',
          template: err,
          okText: 'OK',
          okType: 'button-assertive'
        })
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

    productsEditCtrl.censor = function(text, name) {
      if (!text) {
        return false;
      }
      var censoredText = Censor.censor(text);
      if (censoredText) {
        $ionicPopup.alert({
          title: 'Warning',
          subTitle: 'Your product ' + name + ' contains illegal words (highlighted below)! Please correct it to proceed!',
          template: censoredText,
          okText: 'OK',
          okType: 'button-assertive'
        });
        return true;
      } else {
        return false;
      }
    };

    var validateDataAlert = function(missingField) {
      $ionicPopup.alert({
        title: 'Error',
        template: missingField + ' is required!',
        okText: 'OK',
        okType: 'button-assertive'
      });
    };

    var validateData = function() {
      if (!productsEditCtrl.product) {
        validateDataAlert('Product name');
        return false;
      }
      if (!productsEditCtrl.product.name) {
        validateDataAlert('Product name');
        return false;
      }
      if (!productsEditCtrl.product.price) {
        validateDataAlert('Product price');
        return false;
      }
      if (!productsEditCtrl.product.quantity) {
        validateDataAlert('Product quantity');
        return false;
      }
      if (!productsEditCtrl.product.location) {
        validateDataAlert('Product location');
        return false;
      }
      if (!productsEditCtrl.product.condition) {
        validateDataAlert('Product condition');
        return false;
      }
      if (!productsEditCtrl.product.category) {
        validateDataAlert('Product category');
        return false;
      }
      if (!productsEditCtrl.product.description) {
        validateDataAlert('Product description');
        return false;
      }
    };

    productsEditCtrl.save = function () {

      // Validate data input
      if (!validateData()) {
        return;
      }
      // Censor
      var censoredText = productsEditCtrl.censor(productsEditCtrl.product.name, 'name');
      if (censoredText) {
        return;
      }
      censoredText = productsEditCtrl.censor(productsEditCtrl.product.location, 'location');
      if (censoredText) {
        return;
      }
      censoredText = productsEditCtrl.censor(productsEditCtrl.product.description, 'description');
      if (censoredText) {
        return;
      }
      // Generate SKU
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
