/**红包-美妆商城    					    控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                  pager.js
 * @param   {string} 'lazyLoad'               lazyLoad.js
 */

define([
    'app',
    'angular',
    'cs!style',
    'pager',
    'lazyLoad',
    'cs!smCss',
    'smJs',
    '/common/directive/header/header.js',
    '/common/directive/tab/tab.js',
    'cs!static/css/userCenter/redPacket'
], function(app, angular) {

    /*定义 userCenter/redPacketCtrl 控制器*/
     app.angular.controller('userCenter/redPacketCtrl', [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$http',
        function($rootScope, $scope, $state, $stateParams, $http) {
            $.extend($scope, {
                init: function(){
                    this.staticScope();
                    $scope.tabActive = $stateParams.type;
                    var status = [1, 3, 4];
                    this.userBonus(status[$scope.tabActive]);
                },

                staticScope: function(){
                    app.myApp.settitle($rootScope, '红包-美妆商城');
                    app.myApp.viewport("device");
                },

                userBonus: function($index){
                    $.pager({
                        $scope: $scope,
                        lazyEle: '.lazy',
                        scrollEle: '.content',
                        url: '/account/userBonus',
                        data: {
                            status: $index,
                            v: '1.0'
                        }
                    });
                },

                /* 兑换 */
                headRightFn: function(){
                    $.exchangeModal = $.modal({
                        text: '<img src="/static/img/userCenter/modal-exchange-title.png">' +
                                '<input type="text" placeholder="输入兑换码">' +
                                '<button type="button">确认兑换</button>',
                        extraClass: 'modal-exchange',
                        buttons: [{
                            text: '<img src="/static/img/userCenter/modal-close.png">'
                        }]
                    });

                    $(".modal-text input").on("keyup", function(){
                        if ($(this).val()) $(this).next().addClass("active");
                        else $(this).next().removeClass("active");
                    });

                    $(".modal-text button").on("click", function(){
                        if (!$(this).hasClass("active")) {
                            $.toast("请输入兑换码~", 2000, "total-exchange");
                            return;
                        }
                        $scope.exchangeAjax($(".modal-text input").val());
                    });

                    $("body").on("click", ".modal-overlay", function(){
                        $.closeModal($.exchangeModal);
                    });
                },

                /* 兑换请求 */
                exchangeAjax: function(code){
                    app.myApp.ajax({
                        url: '/account/bonusExchange',
                        data: {
                            code: code
                        }
                    }, function(res) {
                        if (!res.err) {
                            $.toast('兑换成功');
                            $scope.data.rows.push(res.data);
                            $scope.$digest();
                            $.closeModal($.exchangeModal);
                        } else $.toast(res.errMsg);
                    });
                },

                /* tab callback */
                tabMenuFn: function($index){
                    location.hash = '#/userCenter/redPacket/' + $index;
                }
            });

            $scope.init();

        }
    ]);
});