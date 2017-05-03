/**主控制器   依赖JS
 * @param {string} 'app'        app.js
 * @param {string} 'angular'    angular.min.js
 */
define(['app','angular'], function (app,angular) {

    /*定义 mainCtrl 控制器*/
    app.angular.controller('mainCtrl', [
        '$rootScope',
        '$state',
        '$location',
        '$http',
        function($rootScope, $state, $location, $http) {

        /*监听路由变化开始*/
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            $rootScope.toState = toState;
            $rootScope.toParams = toParams;
            $rootScope.fromState = fromState;
            $rootScope.fromParams = fromParams;
        });

        /* 拦截需要登录的url,跳转去登录 */
        app.angular.directive('limitlogin', function() {
            return {
                restrict: 'A',
                replace: false,
                link : function($scope, $element, $attrs) {
                    $element.on("click", function($event){
                        $event.preventDefault();
                        var hash = $attrs.limitlogin || $attrs.href || location.hash;

                        if (app.myApp.ifLogin(hash, location.hash) == false) return;

                        location.hash = hash;
                    });
                }
            };
        });


        /**
         * 算分享提成的渠道：商品详情页、活动专题页、社区分享页面
         * 在用户登录的时候 传shareKey，并删除本地保存的localStorage
         */
        var shareKey_expire_status = new Date().getTime() - localStorage.shareKey_expire > 0 ? true : false;
        var removeLocalShareKey = function(){   // 删除分享key和过期时间
            localStorage.removeItem('shareKey');
            localStorage.removeItem('shareKey_expire');
        }

        if (shareKey_expire_status) removeLocalShareKey();  // 如果过期，删除

        if (app.myApp.iniValue.isLogin() && localStorage.shareKey &&
        !shareKey_expire_status) { // 登录
            app.myApp.http($http, {
                url: '/member/share/visit',
                defaultResErr: false,
                data: {
                    shareKey: localStorage.shareKey
                }
            }, function(){
                removeLocalShareKey();
            })
        }

        /**
         * 完成任务弹窗
         * @param {string} 'isNew'     新手任务
         * @param {string} 'title'     任务名
         * @param {string} 'faceValue' 颜值
         * @param {string} 'exp'       气质值
         */
         $.completeTaskModal = function(missionTip){
             if (!missionTip) return;

             if (missionTip.isNew) {    // 新手任务
                 $.modal({
                     extraClass: 'completeNoviceTaskModal',
                     title: '<h2>' + missionTip.title + '</h2><h3>颜值气质蹭蹭蹭~</h3>',
                     text: '<span class="pull-left">颜值：<span>+' + missionTip.faceValue + '</span></span>'
                     + '<span class="pull-right">气质：<span>+' + missionTip.exp + '</span></span>',
                     afterText: '偷偷告诉你，颜值可以兑换商品，气质值可以升级赢福利哦~',
                     buttons: [{
                         text: '<img src="/common/mod/style/close.png">'
                     }, {
                         text: '查看等级',
                         close: false,
                         onClick: function(){
                             location.href = '#/userCenter/level/0';
                             $.closeModal();
                         }
                     }, {
                         text: '颜值兑换',
                         close: false,
                         onClick: function(){
                             // 兑吧首页链接
                             app.myApp.http($http, {
                                 url: '/member/duiba/url',
                                 method: 'GET',
                                 loading: false
                             }, function(res){
                                 location.href = res.data;
                             });
                             $.closeModal();
                         }
                     }]
                 })
             } else {   // 常规任务
                 $.toast(
                     '<div class="center">' +
                         '<img src="/common/mod/style/common.png" alt="">' +
                         '<div class="title">' + missionTip.title + '</div>' +
                         '<div class="clearfix">' +
                            '<span class="pull-left"><span>+' + missionTip.faceValue + '</span>颜值</span>' +
                            '<span class="pull-right"><span>+' + missionTip.exp + '</span>气质</span>' +
                         '</div>' +
                     '</div>', 3000, 'completeCommonTaskModal');
             }
         }

    }]);
});
