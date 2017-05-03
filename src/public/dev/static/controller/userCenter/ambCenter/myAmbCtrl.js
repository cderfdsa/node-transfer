/**大使分销——我的大使 -美妆商城               控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 */

define([
    'app',
    'angular',
    'moment',
    'cs!style',
    'cs!smCss',
    'smJs',
    'pager',
    'lazyLoad',
    '/common/directive/header/header.js',
    'cs!static/css/userCenter/ambCenter/myAmb'
], function(app, angular, moment) {

    /*定义 myAmbCtrl 控制器*/
    app.angular.controller('userCenter/ambCenter/myAmbCtrl', [
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
                    app.myApp.settitle($rootScope, '我的大使 -美妆商城');
                    app.myApp.viewport("device");
                },

                initAjax: function() {
                    $.pager({
                        $scope: $scope,
                        scrollEle: '.content',
                        url: '/member/my/members',
                        data:{
                            type:1
                        },
                        http: $http,
                        method: 'GET',
                        callBack: function(res) {
                            $(res.data.rows).each(function($index,item){
                                item.lastLogin=moment(item.lastLogin).format('YYYY-MM-DD HH:mm:ss');
                                console.log(item.lastLogin)
                            })
                            if ($scope.data) $scope.data.rows = $scope.data.rows.concat(res.data.rows);
                            else $scope.data = res.data;
                        }
                    });
                },

                headRightFn:function(){
                    location.href='#/userCenter/ambCenter/invite/0'
                },

                /*点击头像去用户中心*/
                toHome:function(item){
                    location.href='#/community/home/'+item.member.id;
                }

            });
            $scope.init();
        }
    ]);
});
