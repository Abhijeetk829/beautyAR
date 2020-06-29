var app = angular.module('beautyAR', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: './templates/home.html',
            controller: "home_ctrl"  
        })

    $urlRouterProvider.otherwise("/home");

});

app.run(function($rootScope, $window) {
    $rootScope.MasterData = MasterData;
})


app.controller('home_ctrl', function($rootScope, $scope, $state, $http, $compile, $window) {
    $window.ymkAsyncInit = function() {
        $window.YMK.open();
    }

    $scope.SelectedBrand;
    $scope.SelectedCosmetic;
    $scope.TouchedProduct = [];
    $scope.Cart = [];
    $scope.currentProduct = false;

    $scope.CosmeticTypeClick = function() {
        $scope.SelectedCosmetic = this.item;
        selected(event);
        $scope.SelectedBrand = undefined;
        $scope.currentProduct = false;
    }

    $scope.BrandClick = function() {
       $scope.SelectedBrand = this.item;
       selected(event);
       $scope.currentProduct = false;
    }

    $rootScope.ApplyMakeup = function() {
        var id = this.item.Id;
        $window.YMK.applyMakeupBySku(id);
        TouchProduct(this.item);
        $scope.currentProduct = this.item;
    }

    $scope.ClearSelection = function() {
        $scope.SelectedBrand = undefined;
        $scope.SelectedCosmetic = undefined;
    }

    $scope.AddToCart = function() {
        if (!$scope.Cart.find(x => x.Id == $scope.currentProduct.Id)) {
            $scope.Cart.push($scope.currentProduct);
        }
    }

    $scope.AddTouchedToCart = function() {
        if ($scope.TouchedProduct.length) {
            for (var a = 0; a < $scope.TouchedProduct.length; a++) {
                if (!$scope.Cart.find(x => x.Id == $scope.TouchedProduct[a].Id)) {
                    $scope.Cart.push($scope.TouchedProduct[a]);
                }
            }
            $scope.TouchedProduct = [];
        }
    }

    $scope.ViewCart = function() {
        var display = parseInt(event.target.dataset.click);
        if (!display) {
            $(".cart").css('display', 'block');
            event.target.dataset.click = 1;
        }   else    {
            $(".cart").css('display', 'none');
            event.target.dataset.click = 0;
        }
    }

    $scope.RemoveFromCart = function() {
        $scope.Cart.splice(this.$index, 1);
    }

    function selected() {
        var a = $("."+event.target.classList[0]);
        for (var b = 0; b < a.length; b++) {
            var arr = a[b].className.split(" ");
            if (arr.indexOf('btn-warning') != -1) {
                a[b].classList.remove('btn-warning');
            }
        }
        event.target.classList.add('btn-warning');
    }

    function TouchProduct(item) {
        if (!$scope.TouchedProduct.find(e => e.Id == item.Id)) {
            $scope.TouchedProduct.push(item);
        }
    }
})