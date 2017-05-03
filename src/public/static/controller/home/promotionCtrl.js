/**美妆秒杀-美妆商城                          控制器 依赖JS CSS
 * @param   {string} 'app'                    app.js
 * @param   {string} 'angular'                angular.min.js
 * @param   {string} 'cs!style'               style.css
 * @param   {string} 'cs!smCss'               sm.min.css
 * @param   {string} 'smJs'                   sm.min.js
 * @param   {string} 'lazyLoad'               lazyLoad.js
 */

define([
    'app',
    'angular',
    'share',
    'cs!style',
    'cs!smCss',
    'smJs',
    'pager',
    'lazyLoad',
    '/common/directive/header/header.js',
    '/common/directive/tab/tab.js',
    'cs!static/css/home/promotion'
], function(app, angular, share) {

    /*定义 wowCtrl 控制器*/
    app.angular.controller('home/promotionCtrl', [
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
                /* 初始化静态 $scope */
                staticScope: function() {
                    app.myApp.settitle($rootScope, '美妆秒杀-美妆商城'); // 设置 title
                    app.myApp.viewport("device"); // 设置viewport
                    $scope.tabActive = $stateParams.type;
                },

                /*初始化*/
                initAjax: function() {
                    app.myApp.http($http, { // 获取系统配置
                        url: '/system/config',
                        method: 'GET'
                    }, function(res){
                        $scope.config = res;
                    })

                    $.pager({
                        $scope: $scope,
                        scrollEle: '.content',
                        url: '/member/product/promotions',
                        pageSize: 10,
                        http: $http,
                        method: 'GET',
                        data: {
                            status: $stateParams.type == 1 ? "0" : ""
                        },
                        callBack: function(res) {
                            if ($scope.data) $scope.data.rows = $scope.data.rows.concat(res.data.rows);
                            else $scope.data = res.data;
                            setTimeout(function() {
                                $scope.countDown($scope.data);
                            })
                        }
                    });
                },

                // 倒计时
                countDown: function(data) {
                    function to2(val){    // 保持两位数字
                        if (val < 10) return '0' + val;
                        else return val;
                    }

                    $(data.rows).each(function(index, item) {
                        var countInterval = setInterval(function() {
                            var timer = ($stateParams.type == 1 ? item.startTime : item.endTime) - new Date().getTime();
                            if (timer <= 0) {
                                data.rows.shift(item);
                                clearInterval(countInterval);
                            }
                            item.hour = timer > 0 ? to2(parseInt(timer/(60*60*1000))) : '00';
                            item.minute = timer > 0 ? to2(parseInt(timer%(60*60*1000)/(60*1000))) : '00';
                            item.second = timer > 0 ? to2(parseInt(timer%(60*60*1000)%(60*1000)/1000)) : '00';
                            $scope.$digest();
                        }, 1000);
                    })
                },

                /*tab切换*/
                tabMenuFn: function($index) {
                    location.hash = '#/home/promotion/' + $index;
                },

                /*头部分享*/
                headRightFn: function() {
                    var shareTitle = $scope.config.sharePromotions.title,
                        shareDesc = $scope.config.sharePromotions.text,
                        shareImgUrl = $scope.config.sharePromotions.image,
                        shareLink = $scope.config.sharePromotions.url,
                        callback = {
                            success: function() {
                                $(".wxfx").remove();
                                app.myApp.recordShare($http, 0, -1);
                            }
                        };
                    share.setContent(shareTitle, shareDesc, shareImgUrl, shareLink, callback);
                    share.popupShare();

                    $("body").delegate(".modal-overlay", "click", function() { // close tip modal
                        $.closeModal();
                    });
                },

                headLeftFn: function() {
                    location.href = '/';
                },

                // /*点击设置提醒*/
                // toRemind: function(item) {
                //     app.myApp.http($http, { //获取用户信息
                //         url: '/member/product/event/notice',
                //         method: 'POST',
                //         data: {
                //             eventId: item.eventId
                //         },
                //     }, function(res) {
                //         $.toast("设置成功!开抢前5分钟会收到提醒~", 2000);
                //         item.isNotice = !item.isNotice;
                //         $scope.$digest();
                //     });
                // },

                /*点击去详情*/
                toGoodsDetail: function(item) {
                    location.href = "#/goods/detail/" + item._id;
                }
            });
            $scope.init();
        }
    ]);
});