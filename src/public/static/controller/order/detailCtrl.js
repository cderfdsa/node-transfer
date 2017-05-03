/**订单详情-美妆商城                            控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */

define(['app',
    'angular',
    'moment',
    'share',
    'cs!smCss',
    'smJs',
    '/common/directive/header/header.js',
    'cs!static/css/order/detail'
], function(app, angular, moment,share) {

    /*定义 orderDetailCtrl 控制器*/
    app.angular.controller('order/detailCtrl', [
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

                staticScope: function() {
                    /*设置标题*/
                    app.myApp.settitle($rootScope, '订单详情-美妆商城');
                    app.myApp.viewport("device");
                    $scope.domain = $domain;
                },

                initAjax: function() {
                    var self = this;
                    app.myApp.http($http, { // 获取系统配置
                        url: '/system/config',
                        method: 'GET'
                    }, function(res){
                        $scope.config = res;
                    })

                    app.myApp.http($http, { //快递详情
                        url: '/member/order/' + $stateParams.id + '/logs',
                        method: 'GET',
                        data: {
                            orderId: $stateParams.id
                        }
                    }, function(res) {
                        $scope.logs = res.data;
                    });

                    app.myApp.http($http, { //订单详情
                        url: '/member/order/' + $stateParams.id + '/detail',
                        method: 'GET',
                        data: {
                            orderId: $stateParams.id
                        }
                    }, function(res) {
                        $(res.data).each(function($index, item) {
                            switch (item.status) {
                                case 0:
                                    item.orderStatus = "待付款";
                                    break;
                                case 1:
                                    item.orderStatus = "待收货";
                                    break;
                                case 3:
                                    item.orderStatus = "待收货";
                                    break;
                                case 6:
                                    item.orderStatus = "交易完成";
                                    break;
                                case -1:
                                    item.orderStatus = "已关闭";
                                    break;
                                case -2:
                                    item.orderStatus = "已关闭";
                                    break;
                            }

                        })
                        $scope.order = res.data;

                        var now = moment().diff(moment($scope.order.createdAt), "seconds"); //时差转成秒
                        var time = parseInt(1800 - now); //30分钟减去时差，等于还剩的时间
                        var countDown = setInterval(function() {
                            time--;
                            var minute = parseInt(time / 60);
                            $scope.minute = minute < 10 ? "0" + minute : minute;
                            if (time <= 0) {
                                clearInterval(countDown);
                            }
                            $scope.time = time % 60< 10? "0" + time % 60 : time % 60;
                            $scope.$digest();
                        }, 1000)

                    });
                },

                /*取消订单*/
                cancelOrder:function(){
                    $.modal({
                        title:'您确定要取消订单？',
                        extraClass: 'order_detail_Modal',
                        buttons: [{
                            text: '不取消了',
                            close: true,
                            onClick: function() {
                                $.closeModal()
                            }
                        },{
                            text: '确认取消',
                            onClick: function() {
                                app.myApp.http($http,{
                                    url:'/member/order/'+ $scope.order.orderId +'/cancel',
                                    method:'POST'
                                },function(res){
                                    $.toast("取消成功！");
                                    location.href='#/order/myOrder/1'
                                },function(res){
                                    $.toast(res.errMsg)
                                })
                            }
                        }]
                    });
                },

                /*二维码*/
                seeCode:function(){
                    app.myApp.http($http,{
                        url:'/member/order/qrcode',
                        method:'POST',
                        data:{
                            codes:$scope.order.code
                        }
                    },function(res){
                        $scope.code = res.data;
                        var see = $.modal({
                            extraClass: 'seeCode_Modal',
                            text:'<img src='+ $scope.code +'>',
                        });
                        setTimeout(function(){
                            $.closeModal(see)
                        },2000)
                    })
                },

                /*微信分享*/
                wxShare: function() {
                    app.myApp.http($http,{
                        url:'/member/order/share',
                        method:'POST',
                        data:{
                            orderId:$scope.order.orderId
                        }
                    },function(res){
                        $scope.share = res.data;
                        var shareTitle = $scope.config.shareOrder.title,
                            shareDesc = $scope.config.shareOrder.text,
                            shareImgUrl =$scope.config.shareOrder.image,
                            shareLink = $scope.config.shareOrder.url + $scope.order.orderId,
                            callback = {
                                success: function() {
                                    $.toast("分享成功！");
                                    $(".wxfx").remove();
                                    app.myApp.recordShare($http, 0, 1);
                                }
                            };

                        share.setContent(shareTitle, shareDesc, shareImgUrl, shareLink, callback);
                        share.popupShare();
                    })
                },

                /*跳转到商品详情*/
                toOrderDetail:function(item){
                    if(item.type == 1){
                        app.myApp.http($http, {
                            url: '/member/product/integral/' + item.productId + '/detail',
                            method: 'GET'
                        }, function(res){
                            location.href = res.data.duibaUrl;
                        });
                    } else {
                        location.href='#/goods/detail/' + item.productId;
                    }
                },

                // 返回
                headLeftFn: function(){
                    if (history.length > 1)
                        history.back()
                    else
                        location.href = "#/order/myOrder/1"
                }

            });
            $scope.init();
        }
    ]);
});