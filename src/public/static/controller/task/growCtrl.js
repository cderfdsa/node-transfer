/**成长中心-美妆商城                         控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */

define([
    'app',
    'angular',
    'cs!style',
    'cs!smCss',
    'smJs',
    '/common/directive/header/header.js',
    'cs!static/css/task/grow'
], function(app, angular) {

    /*定义 task/growCtrl 控制器*/
    app.angular.controller('task/growCtrl', [
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
                app.myApp.settitle($rootScope, '成长中心-美妆商城');    // set title
                app.myApp.viewport("device");
            },

            /* get initialize data */
            initAjax: function() {
                // 用户任务列表
                app.myApp.http($http, {
                    url: '/member/mission/list/new',
                    method: 'GET'
                }, function(res){
                    $scope.missions = res.data;
                });
            },

            /* task tip modal */
            toModal: function(newbieTask) {
                var text = newbieTask.reward > 0 ? newbieTask.reward + (newbieTask.rewardType?"现金":"颜值") : "";
                var exp = newbieTask.exp > 0 ? newbieTask.exp +"气质值" : "";
                var button = newbieTask.link?"去完成":"我知道了";
                $.modal({
                    title: newbieTask.name,
                    text: '<img src="static/img/task/growthCenterModal.png">' +
                    '<p class="reward">' + newbieTask.desc + '</p>' + '<p>'
                    +'(任务完成后，奖励'+  text + exp +')</p>',
                    extraClass: 'growthCenterModal',
                    buttons: [{
                        text: button,
                        close: true,
                        onClick: function() {
                            if(newbieTask.link||newbieTask.link!=""){
                                location.href = $domain + newbieTask.link;
                            }else{
                                $.closeModal();
                            }

                        }
                    }, {
                        text: '<img src="static/img/task/Close_icon.png" >',
                        onClick: function() {
                            $.closeModal();
                        }
                    }]
                });
            },

            /* 返回 */
            headLeftFn: function(){
                if(/fromSignIn/g.test(location.hash)){
                    location.href = '#/home';
                } else {
                    history.go(-1);
                }
            }
        });

        $scope.init();
    }]);
});
