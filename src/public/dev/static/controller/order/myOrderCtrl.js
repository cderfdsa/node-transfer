/**我的wow-美妆商城                          控制器 依赖JS CSS
 * @param   {string} 'app'                    app.js
 * @param   {string} 'angular'                angular.min.js
 * @param   {string} 'cs!style'               style.css
 * @param   {string} 'cs!smCss'               sm.min.css
 * @param   {string} 'smJs'                   sm.min.js
 * @param   {string} 'lazyLoad'               lazyLoad.js
 */

define(['app',
        'angular',
        'moment',
        'cs!style',
        'cs!smCss',
        'smJs',
        'lazyLoad',
        '/common/directive/header/header.js',
        '/common/directive/tab/tab.js',
        'cs!static/css/order/myOrder'
        ], function(app, angular,moment) {

    /*定义 wowCtrl 控制器*/
    app.angular.controller('order/myOrderCtrl', ['$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$http', function($rootScope, $scope, $state, $stateParams, $http) {

        $.extend($scope, {
            init: function() {
                this.staticScope();
                this.initAjax();

            },
            /* 初始化静态 $scope */
            staticScope: function() {
                app.myApp.settitle($rootScope, '我的订单-美妆商城'); // 设置 title
                app.myApp.viewport("device"); // 设置viewport
                $scope.domain = $domain;    // set domain
                $scope.tabActive = $stateParams.type;
                $scope.domain = $domain;
            },

            /*初始化*/
            initAjax:function(){
                var self = this;
                app.myApp.http($http,{ //获取订单列表
                    url:'/member/order/list',
                    method:'GET',
                    data:{
                        status: $stateParams.type
                    }
                },function(res){
                    if(!res.err){
                        $(res.data).each(function(index,item){//整个订单循环
                            item.createdAt = moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss");
                            switch(item.status) {
                                case 1:
                                        item.text="待收货";
                                        break;
                                case -1:
                                        item.text= "已关闭";
                                        break;
                            }
                        })
                        $scope.order = res.data;
                    }

                })
            },

            /* tab 切换回调 */
            tabMenuFn: function($index) {
                location.hash = '#/order/myOrder/' + $index;
            },

            headLeftFn: function() {
                location.hash = '#/userCenter';
            },
            /*取消订单*/
            cancelOrder:function(item){
                $.modal({
                    title:'您确定要取消订单？',
                    extraClass: 'cancelOrderModal',
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
                                url:'/member/order/'+ item.orderId +'/cancel',
                                method:'POST'
                            },function(res){
                                $.toast("取消成功！");
                                $scope.order.shift();
                            },function(res){
                                $.toast(res.errMsg)
                            })
                        }
                    }]
                });
            },

            /*跳转到商品详情*/
            toOrderdetail:function(orderItem){
                if(orderItem.type == 1){
                    app.myApp.http($http, {
                        url: '/member/product/integral/' + orderItem.productId + '/detail',
                        method: 'GET'
                    }, function(res){
                        location.href = res.data.duibaUrl;
                    });
                } else {
                    location.href='#/goods/detail/' + orderItem.productId;
                }
            },
            /*确认收货*/
            confirm:function(item){
                app.myApp.http($http,{
                    url:'/member/order/'+ item.orderId + '/recived',
                    method:'POST',
                },function(res){
                    $scope.confirm = res.data;
                    $.toast("确认收货成功");
                    $scope.order.shift();
                },function(res){
                    $.toast(res.errMsg)
                })
            }

        });
        $scope.init();

    }]);
});
