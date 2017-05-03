/**大使分销——购买校园大使套餐 -美妆商城     控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 * @param   {string} 'pingpp'               pingpp.js
 */

define([
    'app',
    'angular',
    // 'pingpp',
    'cs!style',
    'cs!smCss',
    'smJs',
    'address',
    '/common/directive/header/header.js',
    'cs!static/css/userCenter/ambCenter/specialBuy'
], function(app, angular/*, pingpp*/) {

    /*定义 specialBuyCtrl 控制器*/
    app.angular.controller('userCenter/ambCenter/specialBuyCtrl', [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$http',
        function($rootScope, $scope, $state, $stateParams, $http) {

            $.extend($scope, {
                init: function() {
                    this.staticScope();
                    this.initAddress();
                },

                staticScope: function() {
                    /*设置标题*/
                    app.myApp.settitle($rootScope, '购买校园大使套餐 -美妆商城');
                    app.myApp.viewport("device");

                    $scope.isWeiXin = app.myApp.iniValue.isWeiXin;  // 是否是微信
                    $scope.inviteCode = $rootScope.ambSpecoial_inviteCode; // 带过来的邀请码
                    $rootScope.ambSpecoial_inviteCode = null;

                    $scope.payType = [4, 0][Number($scope.isWeiXin)];
                    $scope.gift = 1;
                    $scope.cashCoupon = true;
                },

                /* select address: province city area */
                initAddress: function(){
                    $("#selectAddress").address({
                       data: [{
                            title: '省',
                            list: '/province/list',
                            http: $http,
                            method: 'GET'
                        }, {
                            title: '市',
                            list: '/city/list',
                            http: $http,
                            method: 'GET',
                            data: 'provinceId'
                        }, {
                            title: '区域',
                            list: '/area/list',
                            http: $http,
                            method: 'GET',
                            data: 'cityId',
                            limitData: {}
                        }],
                        callback: function(self){
                            $scope.province = $(".address_popup_title span").eq(1).data("id");
                            $scope.city = $(".address_popup_title span").eq(2).data("id");
                            $scope.area = $("#selectAddress").data("id");
                            $("#selectAddress").val(
                                $(".address_popup_title span").eq(0).text() + '省 ' +
                                $(".address_popup_title span").eq(1).text() + '市 ' +
                                $("#selectAddress").val()
                            )
                    }});
                },

                /* to pay */
                toPay: function(){
                    if($scope.gift==1){
                        if(!$scope.inviteCode){
                            $.toast("请填写合伙人邀请码！");
                            return;
                        }
                        if ($scope.payType == 5 && !$scope.cardPasswd) {
                            $.toast("请输入秘钥！");
                            return;
                        }
                        $scope.confirmOrder();
                    }else{
                        if(!$scope.inviteCode){
                            $.toast("请填写合伙人邀请码！");
                            return;
                        }
                        if (!$scope.linkman) {
                            $.toast("请填写收货人姓名！");
                            return;
                        }
                        if (!$scope.mobile) {
                            $.toast("请填写联系电话！");
                            return;
                        }
                        if (!$("#selectAddress").val()) {
                            $.toast("请选择省、市、区！");
                            return;
                        }
                        if (!$scope.addressStr) {
                            $.toast("请填写详细地址！");
                            return;
                        }
                        if ($scope.payType == 5 && !$scope.cardPasswd) {
                            $.toast("请输入秘钥！");
                            return;
                        }
                        $scope.confirmOrder();
                    }
                },

                /*to customerService*/
                customerService:function(){
                    location.href='http://www.sobot.com/chat/h5/index.html?sysNum=223c05fc5274431aba46d0555930a877&source=1'
                },
                /* confirm oreder */
                confirmOrder: function(){
                    app.myApp.http($http, {
                        url: '/member/senior/order/create',
                        method: 'POST',
                        data: $.extend([
                                {}, {cardPasswd: $scope.cardPasswd}
                            ][Number($scope.payType == 5)], {
                            linkman: $scope.linkman,
                            v:'1.0',
                            productType:$scope.gift,
                            mobile: $scope.mobile,
                            provinceId: $scope.province,
                            cityId: $scope.city,
                            areaId: $scope.area,
                            addressStr: $scope.addressStr,
                            inviteCode: $scope.inviteCode, // 邀请码
                            origin: 0,  // 下单来源#0:微信 1:IOS 2:Android
                            payType: $scope.payType
                        })
                    }, function(res){
                    // 秘钥支付
                    if ($scope.payType == 5) {
                        $.toast('支付成功');
                        $rootScope.specialBuy_orderId = res.data;
                        location.href = '#/userCenter/ambCenter/buySuccess';
                        return;
                    }
// 支付有bug 先跳php
location.href = $domain + '/order/pingxx/oid/' + res.data;
return;
                        $scope.createCharge(res.data);
                    })
                },

                /* 请求支付签名 支付 */
                createCharge: function(orderId){
                    var data = {
                        orderId: orderId   // 订单号
                    }

                    if ($scope.isWeiXin)    // openId(选填，客户端支付不需要)
                        data.openId = $.getCookie("user_auth_openid");
                    else    // (选填，客户端支付不需要)
                        data.successUrl = location.origin + '/#/userCenter/ambCenter/buySuccess';

                    $.toast('支付中，请稍后 ···', 10000);
                    app.myApp.http($http, {
                        url: '/member/order/createCharge',
                        data: data
                    }, function(res){
                        pingpp.createPayment(res.data, function(result, err){
                            $.closeModal();
                            if (result == "success") {
                                $.toast('支付成功');
                                $rootScope.specialBuy_orderId = orderId;
                                location.href = '#/userCenter/ambCenter/buySuccess';
                                // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                            } else if (result == "fail") {
                                $.toast('支付失败');
                                location.href='#/order/myOrder/1';
                            } else if (result == "cancel") {
                                $.toast('请继续付款，未完成付款，订单将关闭！');
                            }
                        });
                    });
                }
            });

            $scope.init();
        }
    ]);
});