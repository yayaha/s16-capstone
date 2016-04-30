// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('emiratesApp', ['ionic', 'ngCordova', 'firebase', 'angular-md5'])

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
            //console.log('department ' + $stateParams.departmentId);
            // If accessed directly (which happens only when debugging), the program must retrieve department list first.
            //return Shop.all().$loaded().then(function(){
            return Shop.getDepartment($stateParams.departmentId).$value;
            //});
          },
          productList: function($stateParams, Shop) {
            return Shop.getProductList($stateParams.departmentId).$loaded();
          }
        }
      })


      .state('tab.product-detail', {
        url: '/product/:productId',
        views: {
          'tab-home': {
            templateUrl: 'templates/shop/product-detail.html',
            controller: 'ProductCtrl as productCtrl'
          }
        },
        resolve: {
          product: function($stateParams, Shop) {
            return Shop.getProduct($stateParams.productId).$loaded();
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
        }
      })

      .state('tab.checkout', {
        url: '/checkout',
        views: {
          'tab-cart': {
            templateUrl: 'templates/cart/checkout.html',
            controller: 'CartCtrl as cartCtrl'
          }
        },
        resolve: {
          auth: function($state, $ionicPopup, Auth) {
            var authData = Auth.auth.$getAuth();
            if (authData) {
              return authData;
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
        }
      })

      .state('tab.review-order', {
        url: '/review',
        views: {
          'tab-cart': {
            templateUrl: 'templates/cart/review-order.html',
            controller: 'CartCtrl as cartCtrl'
          }
        },
        resolve: {
          auth: function($state, $ionicPopup, Auth) {
            var authData = Auth.auth.$getAuth();
            if (authData) {
              return authData;
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
        }
      })

      .state('tab.account-dash', {
        url: '/account',
        cache: false,
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
            return Auth.auth.$requireAuth().catch(function(error){
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
      })

      .state('tab.bought-order', {
        url: '/boughtOrder',
        views: {
          'tab-account': {
            templateUrl: 'templates/order/item-bought.html',
            controller: 'BoughtOrderCtrl as boughtOrderCtrl'
          }
        },
        resolve: {
          auth: function ($state, Auth) {
            return Auth.auth.$requireAuth().catch(function () {
              $state.go('tab.login');
            });
          },
          orders: function(Auth, Order) {
            return Auth.auth.$requireAuth().then(function(auth) {
              return Order.getBuyerOrders(auth.uid).$loaded();
            });
          }
        }
      })
      .state('tab.bought-order-review', {
        url: '/boughtOrder/:orderKey',
        views: {
          'tab-account': {
            templateUrl: 'templates/order/item-bought-review.html',
            controller: 'BoughtOrderReviewCtrl as boughtOrderReviewCtrl'
          }
        },
        resolve: {
          auth: function ($state, Auth) {
            return Auth.auth.$requireAuth().catch(function () {
              $state.go('tab.login');
            });
          },
          currentOrder: function(Auth, Order, $stateParams) {
            return Auth.auth.$requireAuth().then(function(auth) {
              return Order.getBuyerOrders(auth.uid).$loaded().then(function(data) {
                return data.$getRecord($stateParams.orderKey);
              });
            });
          }
        }
      })

      .state('tab.sold-order', {
        url: '/soldOrder',
        views: {
          'tab-account': {
            templateUrl: 'templates/order/item-sold.html',
            controller: 'SoldOrderCtrl as soldOrderCtrl'
          }
        },
        resolve: {
          auth: function ($state, Auth) {
            return Auth.auth.$requireAuth().catch(function () {
              $state.go('tab.login');
            });
          },
          orders: function(Auth, Order) {
            return Auth.auth.$requireAuth().then(function(auth) {
              return Order.getSellerOrders(auth.uid).$loaded();
            });
          }
        }
      })
      .state('tab.sold-order-review', {
        url: '/soldOrder/:orderKey',
        views: {
          'tab-account': {
            templateUrl: 'templates/order/item-sold-review.html',
            controller: 'SoldOrderReviewCtrl as soldOrderReviewCtrl'
          }
        },
        resolve: {
          auth: function ($state, Auth) {
            return Auth.auth.$requireAuth().catch(function () {
              $state.go('tab.login');
            });
          },
          currentOrder: function(Auth, Order, $stateParams) {
            return Auth.auth.$requireAuth().then(function(auth) {
              return Order.getSellerOrders(auth.uid).$loaded().then(function(data) {
                return data.$getRecord($stateParams.orderKey);
              });
            });
          }
        }
      })

      .state('tab.product-management', {
        url: '/productManagement',
        views: {
          'tab-account': {
            templateUrl: 'templates/products/products-management.html',
            controller: 'ProductsManagementCtrl as productsManagementCtrl'
          }
        },
        resolve: {
          auth: function ($state, Auth) {
            return Auth.auth.$requireAuth().catch(function () {
              $state.go('tab.login');
            });
          },
          products: function(Auth, ProductsManagement) {
            return Auth.auth.$requireAuth().then(function(auth) {
              return ProductsManagement.getProductsForUser(auth.uid).$loaded();
            })
          }
        }
      })

      .state('tab.edit-product', {
        url: '/edit-product',
        views: {
          'tab-account': {
            templateUrl: 'templates/products/products-edit.html',
            controller: 'ProductsEditCtrl as productsEditCtrl'
          }
        },
        params: {'productId': null},
        resolve: {
          auth: function ($state, Auth) {
            return Auth.auth.$requireAuth().catch(function () {
              $state.go('tab.login');
            });
          },
          departments: function(Shop) {
            return Shop.all();
          },
          product: function($stateParams, Shop) {
            if ($stateParams.productId) {
              return Shop.getProduct($stateParams.productId).$loaded();
            } else {
              return null;
            }
          }
        }
      })

    ;

    $urlRouterProvider.otherwise('/tab/departments');
  })

  .filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
      return $filter('number')(input * 100, decimals) + '%';
    };
  }])

  .constant('FirebaseUrl', 'https://cmu-emirates.firebaseio.com/')
  .constant('TaxRate', 0.05)
  .constant('OrderStatusEnum', {
    PENDING: 'Pending',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    COMPLETE: 'Complete'
  });
