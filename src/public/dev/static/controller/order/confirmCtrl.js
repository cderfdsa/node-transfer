/**确认订单   控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */
define([
    'app',
    'angular',
    'cs!style',
    'cs!smCss',
    'smJs',
    '/common/directive/header/header.js',
    'cs!static/css/order/confirm'
], function(app, angular) {

    /* define order/confirmCtrl controller */
    app.angular.controller('order/confirmCtrl', [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$http',
        function($rootScope, $scope, $state, $stateParams, $http) {

        $.extend($scope, {
            init: function() {
                this.staticScope();
                this.initAjax();
            },

            /* initialize static $scope */
            staticScope: function() {
                app.myApp.settitle($rootScope, '确认订单-美妆商城'); // set title
                app.myApp.viewport("device"); // set viewport
                $scope.isCart = $stateParams.isCart;

                $scope.orderProducts = [];    // submit order data
                $scope.products = [];           // 运费商品id数组
                $scope.cartProducts = [];   // delete cart goods
                $scope.oldPrice = 0;        // 原价总价
                $scope.goodsPrice = 0    // 订单实付金额
                $scope.orderConfirmProducts = localStorage.orderConfirmProducts && JSON.parse(localStorage.orderConfirmProducts);
                if (!$scope.orderConfirmProducts) { // 返回等无数据的情况
                    $(".order_confirm_header, .order_confirm, .order_confirm_footer").hide();
                    $.alert('商品不存在，请重新选购', function(){
                        location.hash = '#/goods';
                    });
                }
            },

            /* get initialize data */
            initAjax: function() {
                function getPostage() {
                    // 选择地址跳转回来
                    if ($rootScope.selectAddress) {
                        $scope.address = $rootScope.selectAddress;
                        $rootScope.selectAddress = null;
                        $scope.getPostage();
                        return;
                    }

                    // 请求地址列表
                    app.myApp.http($http, {
                        url: '/member/address/list',
                        method: 'GET'
                    }, function(res){
                        // 没有地址 退出
                        if (!res.data.length) return;
                        // 选用默认地址
                        $(res.data).each(function(index, item){
                            if (item.isDefault) $scope.address = res.data[index];
                        });
                        // 没有默认取第一个
                        if (!$scope.address) $scope.address = res.data[0] || {};
                        $scope.getPostage();
                    });
                }

                // 是否是大使
                app.myApp.http($http, {
                    url: '/member/detail',
                    data: {
                        v: 1.0
                    },
                    method: 'GET'
                }, function(res){
                    $scope.seniorMember = res.data.seniorMember;

                    $($scope.orderConfirmProducts).each(function(index, item){
                        // 下单 data
                        $scope.orderProducts[index] = {
                            'product': item.product._id,
                            'standard': item.standard.id,
                            'qty': item.qty
                        };

                        // 运费 商品ids
                        $scope.products[index] = item.product._id;

                        // 来源购物车 加购物车id
                        if ($stateParams.isCart)
                            $scope.orderProducts[index].cartId = item.cart._id;

                        // 删除购物车 data
                        $scope.cartProducts[index] = {
                            'product': item.product._id,
                            'standard': item.standard.id
                        };

                        // 商品折扣金额（在大使非特卖情况下）
                        item.product.rebatePrice = (item.event || item.type || !$scope.seniorMember) ? 0 : item.product.rebatePrice;
                        $scope.oldPrice += item.product.type ? 0 : item.cart.price * item.qty;  //原价总价
                        $scope.goodsPrice += item.product.type ? 0 : (item.cart.price - item.product.rebatePrice) * item.qty;  //减去商品优惠后总价
                    });

                    getPostage();
                });
            },

            /* get postage */
            getPostage: function(){
                if (!$scope.address.type) {
                    $scope.postage = 0;
                    return;
                }

                app.myApp.http($http, {
                    url: '/member/order/calPostage',
                    method: 'POST',
                    data: {
                        provinceId: $scope.address.provinceId,  // 省份id
                        totalPrice: $scope.goodsPrice,          // 订单实付金额
                        products: $scope.products               // 订单id数组
                    }
                }, function(res){
                    $scope.postage = res.data;
                    $scope.totalPrice = Number($scope.goodsPrice) + Number($scope.postage);
                });
            },

            /* submit order */
            submitOrder: function(){
                app.myApp.cnzz('orderCreate');

                // 查看地址是否填写
                if (!$scope.address || !$scope.address.addressStr) {
                    $.toast("请先填写收货地址");
                    return;
                }

                $.toast('订单生成中，请稍后···', 10000);

                app.myApp.http($http, {
                    url: '/member/order/create',
                    data: {
                        remark: $scope.remark,
                        orderProducts: $scope.orderProducts,
                        addressId: $scope.address._id,
                        isCart: Boolean(Number($stateParams.isCart))
                    },
                    defaultResErr: false
                }, function(res){
                    $.closeModal();
                    if (!res.err) {
                        if ($stateParams.isCart) {
                            $scope.delCartProducts(res.data);
                            return;
                        }
                        localStorage.removeItem('orderConfirmProducts');
                        location.href = '#/order/pay/' + res.data;
                    } else $.toast(res.errMsg)
                });
            },

            /* 来源为购物车 删除购物车中相应商品 */
            delCartProducts: function(orderid){
                app.myApp.http($http, {
                    url: '/member/cart/delete/products',
                    data: {
                        products: $scope.cartProducts
                    }
                }, function(res){
                    localStorage.removeItem('orderConfirmProducts');
                    location.href = '#/order/pay/' + orderid;
                });
            },

            /* 邮费 popup */
            popup: function(type) {
                $scope.popupClass = type == 'close' ? 'slideDown' : 'slideUp';
            }

        });

        $scope.init();
    }]);
});
