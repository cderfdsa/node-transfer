/**订单支付   控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pingpp'               pingpp.js
 */
define([
    'app',
    'angular',
    // 'pingpp',
    'cs!style',
    'cs!smCss',
    'smJs',
    '/common/directive/header/header.js',
    'cs!static/css/order/pay'
], function(app, angular/*, pingpp*/) {

    /* define order/payCtrl controller */
    app.angular.controller('order/payCtrl', [
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
                app.myApp.settitle($rootScope, '订单支付-美妆商城'); // set title
                app.myApp.viewport("device"); // set viewport
                $scope.isWeiXin = app.myApp.iniValue.isWeiXin;  // is weixin
                $scope.from = $stateParams.from;    // if from my order, coupon can't change
                $scope.payTypeObj = [{
                    type: 'balance',
                    value: 2
                }, {
                    type: 'wechat',
                    value: 0
                }, {
                    type: 'alipay',
                    value: 4
                }];
            },

            /* get initialize data */
            initAjax: function() {
                app.myApp.http($http, { //获取用户信息
                    url: '/member/detail',
                    data: {
                        v: 1.0
                    },
                    method: 'GET'
                }, function(res){
                    $scope.userInfo = res.data;
                });

                app.myApp.http($http, { //获取订单详情
                    url: '/member/order/' + $stateParams.orderId + '/detail',
                    method: 'GET'
                }, function(res){
                   $scope.data = res.data;
                   if ($scope.data.status !== 0) {
                        $.alert('该订单已付款或已关闭', function(){
                            location.hash = '#/order/myOrder/2';
                        });
                   }

                   $scope.getCoupons();
                   $scope.countDown();
                });
            },

            /* 兑吧商品详情链接 */
            linkGoodsUri: function(productId, type){
                if (type == 1) {
                    app.myApp.http($http, {
                        url: '/member/product/integral/' + productId + '/detail',
                        method: 'GET'
                    }, function(res){
                        location.href = res.data.duibaUrl;
                    });
                } else
                    location.hash = '#/goods/detail/' + productId;
            },

            /* get coupons */
            getCoupons: function(){
                if ($scope.data.discountPrice) {
                    $scope.getBalance();
                    return;
                }

                if (!$rootScope.orderCouponsSelect) {
                    if ($scope.from == 'myOrder') { // 订单去支付
                        $scope.getBalance();
                        return;
                    }

                    app.myApp.http($http, {
                        url: '/member/coupons',
                        method: 'GET',
                        data: {orderId: $stateParams.orderId}
                    }, function(res){
                        $scope.coupons = res.data;
                        if ($scope.coupons.length)
                            $rootScope.orderCouponsSelect = {id: "none", value: 0};
                            // $scope.data.discountPrice = $scope.coupons[0].value;
                        $scope.getBalance();
                    });
                } else {
                    $scope.data.discountPrice = $rootScope.orderCouponsSelect.value;
                    // $rootScope.orderCouponsSelect = null;

                    $scope.getBalance();
                }
            },

            /* get money balance */
            getBalance: function(){
                app.myApp.http($http, {
                    url: '/member/money/balance',
                    method: 'GET',
                    data: {orderId: $stateParams.orderId}
                }, function(res){
                    $scope.balance = parseFloat(res.data.balance);
                    $scope.judgeStatus();

                });
            },

            /* judge check status & total price */
            judgeStatus: function(type){
                if ($scope.balance > 0 && type != 'check') $scope.payTypeObj[0].checked = true;

                var truePrice = $scope.data.totalPrice - $scope.data.seniorDiscountPrice - $scope.data.discountPrice + $scope.data.postage;
                var needPayPrice = truePrice - ($scope.payTypeObj[0].checked ? $scope.balance : 0);
                $scope.needPayPrice = needPayPrice > 0 ? needPayPrice : 0;
                var balancePayPrice = truePrice - ($scope.payTypeObj[0].checked ? 0 : $scope.balance);
                $scope.balancePayPrice = balancePayPrice > 0 ? ($scope.balance > balancePayPrice ? balancePayPrice : $scope.balance) : 0;

                if ($scope.needPayPrice)
                    $scope.payTypeObj[2 - Number($scope.isWeiXin)].checked = true;
            },

            /* 30 minute count down */
            countDown: function(){
                // 元气街接入改动
                if ($scope.data.isVirtual) {
                    $scope.time = '支付'
                    return
                }

                var createdAt = new Date($scope.data.createdAt).getTime(),    // 订单创建时间
                    now = new Date().getTime(); // now

                var sec = 30*60 - ((now - createdAt)/1000).toFixed();   // 剩余时间 精确到秒

                var interval = setInterval(function(){
                    sec --;
                    $scope.time = '支付 ' + parseInt(sec/60) + ':' + (sec%60 < 10 ? '0' : '') + sec%60;
                    if (sec <= 0) {
                        clearInterval(interval);
                        $scope.time = '已关闭';
                        $scope.payBtnClass = 'default';
                    }
                    $scope.$digest();
                }, 1000);
            },

            /* check pay type */
            checkPayType: function(index){
                // 余额为0时选用余额
                if (!index && !$scope.balance) return;
                // 选用第三方支付 且余额不够付
                if (index && $scope.needPayPrice) {
                    $scope.payTypeObj[index].checked = true;
                    return;
                }

                $scope.payTypeObj[index].checked = !$scope.payTypeObj[index].checked;

                $scope.judgeStatus('check');
            },

            /* pay order */
            payOrder: function(){
                app.myApp.cnzz('orderPay');

                if ($scope.payBtnClass) {
                    $.toast("支付失败：该订单支付时间已过");
                    return;
                }

                var couponId;   // 优惠券ID(选填)
                if ($rootScope.orderCouponsSelect) {
                    couponId = $rootScope.orderCouponsSelect.id != 'none' ? $rootScope.orderCouponsSelect.id : '';
                } else if ($scope.coupons && $scope.coupons.length) {
                    couponId = $scope.coupons[0].id
                } else {
                    couponId = $scope.data.couponId
                }

                app.myApp.http($http, {  // 设置支付方式与优惠券
                    url: '/member/order/' + $stateParams.orderId + '/changePayType',
                    data: {
                        couponId: couponId, // 优惠券ID(选填)
                        balance: (!!$scope.payTypeObj[0].checked).toString(),  // 是否用余额(选填)
                        payType:  $scope.payTypeObj[Number(2 - !!$scope.payTypeObj[1].checked)].value   // 支付方式(必填)
                    }
                }, function(res){
// 支付有bug 先跳php
location.href = $domain + '/order/pingxx/oid/' + $stateParams.orderId;
return;
                    $scope.createCharge();
                });
            },

            /* 请求支付签名 支付 */
            createCharge: function(){
                var data = {
                    orderId: $stateParams.orderId   // 订单号
                }

                if ($scope.isWeiXin)    // openId(选填，客户端支付不需要)
                    data.openId = $.getCookie("user_auth_openid");
                else    // (选填，客户端支付不需要)
                    data.successUrl = location.origin + '/#/order/myOrder/2';

                app.myApp.http($http, {
                    url: '/member/order/createCharge',
                    data: data,
                    defaultResErr: false
                }, function(res){
                    if (!res.err) {
                        pingpp.createPayment(JSON.stringify(res.data), function(result, err){
                            $.closeModal();
                            if (result == "success") {
                                $.toast('支付成功');

                                setTimeout("location.href='#/order/myOrder/2'", 2000);
                                // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                            } else if (result == "fail") {
                                $.toast('支付失败');
                                setTimeout("location.href='#/order/myOrder/1'", 2000);
                            } else if (result == "cancel") {
                                $.toast('请继续付款，未完成付款，订单将关闭！');
                            }
                        });
                    } else {
                        $.toast(res.errMsg);
                        if (res.errMsg == "订单已付款")
                            setTimeout("location.href='#/order/myOrder/2'", 2000);
                    }
                });
            },

            /* 邮费 popup */
            popup: function(type) {
                $scope.popupClass = type == 'close' ? 'slideDown' : 'slideUp';
            },

            /* 返回 */
            headLeftFn: function(){
                location.hash = '#/userCenter';
            }

        });

        $scope.init();
    }]);
});
