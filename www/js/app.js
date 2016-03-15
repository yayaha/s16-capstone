// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('emiratesApp', ['ionic', 'firebase', 'angular-md5'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider) {

    $ionicConfigProvider.tabs.position('bottom');

    $stateProvider

      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      .state('tab.departments', {
        url: '/departments',
        resolve: {
          departments: function(Shop) {
            return Shop.all();
          }
        },
        views: {
          'tab-home': {
            templateUrl: 'templates/shop/departments.html',
            controller: 'DepartmentsCtrl as departmentsCtrl'
          }
        }
      })

      .state('tab.product-list', {
        url: '/product-list/:departmentId',
        views: {
          'tab-home': {
            templateUrl: 'templates/shop/product-list.html',
            controller: 'ProductListCtrl as productListCtrl'
          }
        },
        resolve: {
          departmentName: function($stateParams, Shop) {
            console.log('department ' + $stateParams.departmentId);
            // If accessed directly (which happens only when debugging), the program must retrieve department list first.
            //return Shop.all().$loaded().then(function(){
            return Shop.getDepartment($stateParams.departmentId).$value;
            //});
          },
          productList: function($stateParams, Shop) {
            return Shop.getProductList($stateParams.departmentId);
          }
        }
      })


      .state('tab.product-detail', {
        url: '/product/:departmentId/:productId',
        views: {
          'tab-home': {
            templateUrl: 'templates/shop/product-detail.html',
            controller: 'ProductCtrl as productCtrl'
          }
        },
        resolve: {
          product: function($stateParams, Shop) {
            return Shop.getProduct($stateParams.departmentId, $stateParams.productId);
          }
        }
      })

      .state('tab.cart', {
        url: '/cart',
        views: {
          'tab-cart': {
            templateUrl: 'templates/cart/cart.html',
            controller: 'CartCtrl as cartCtrl'
          }
        },
        resolve: {
          auth: function($state, $ionicPopup, Auth) {
            var authData = Auth.auth.$getAuth();
            if (authData) {
              return authData;
              //return {
              //  auth: authData,
              //  cart: Shop.cart(data.uid).$loaded().then(function (x) {
              //    return x;
              //  })
              //};
            } else {
              $ionicPopup.alert({
                title: "Login Required",
                template: "You must log in to view your cart",
                okType: "button-assertive"
              }).then(function () {
                $state.go('tab.login');
              });
            }
          }

          //auth: function($state, $ionicPopup, Auth) {
          //  return Auth.auth.$requireAuth().then(function(auth) {
          //    return auth;
          //  }, function() {
          //    $ionicPopup.alert({
          //      title: "Login Required",
          //      template: "You must log in to view your cart",
          //      okType: "button-assertive"
          //    }).then(function() {
          //      $state.go('tab.login');
          //    })
          //  })
          //},
          //cart: function(auth, Cart) {
          //  return Cart.cart(auth.uid).$loaded();
          //}
        }
      })

      .state('tab.account-dash', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/account/account.html',
            controller: 'AccountDashCtrl as acctCtrl'
          }
        },
        resolve: {
          auth: function($state, Auth) {
            return Auth.auth.$requireAuth().catch(function(){
              $state.go('tab.login');
            });
          },
          profile: function(Auth, Profile) {
            return Auth.auth.$requireAuth().then(function(auth) {
              return Profile.getProfile(auth.uid).$loaded();
            });
          }
        }
      })

      .state('tab.edit-profile', {
        url: '/edit-profile',
        views: {
          'tab-account': {
            templateUrl: 'templates/account/edit-profile.html',
            controller: 'ProfileCtrl as profileCtrl'
          }
        },
        resolve: {
          auth: function($state, Auth) {
            console.log('auth');
            return Auth.auth.$requireAuth().catch(function(error){
              $state.go('tab.login');
              console.log(error);
            });
          },
          profile: function(Auth, Profile) {
            console.log('profile');
            return Auth.auth.$requireAuth().then(function(auth) {
              return Profile.getProfile(auth.uid).$loaded();
            });
          }
        }
      })

      .state('tab.login', {
        url: '/login',
        views: {
          'tab-account': {
            templateUrl: 'templates/account/authentication.html',
            controller: 'AuthCtrl as authCtrl'
          }
        },
        resolve: {
          unauth: function($state, Auth) {
            return Auth.auth.$requireAuth().then(function(){
              $state.go('tab.account-dash');
            }, function(){

            })
          }
        }
      });
    $urlRouterProvider.otherwise('/tab/departments');
  })
  .constant('FirebaseUrl', 'https://cmu-emirates.firebaseio.com/');
