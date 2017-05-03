/**大使分销——规则说明详情 -美妆商城             控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 */

define([
    'app',
    'angular',
    'cs!style',
    'cs!smCss',
    'smJs',
    'pager',
    '/common/directive/header/header.js',
    'cs!static/css/userCenter/ambCenter/explainDetail'
], function(app, angular, moment) {

    /*定义 incomeDetailCtrl 控制器*/
    app.angular.controller('userCenter/ambCenter/explainDetailCtrl', [
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
                    app.myApp.settitle($rootScope, '规则说明详情 -美妆商城');
                    app.myApp.viewport("device");
                    $scope.type = $stateParams.type;
                },

                initAjax: function(){
                    app.myApp.http($http, { // 获取系统配置
    					url: '/system/config',
    					method: 'GET'
    				}, function(res){
    					$scope.config = res;
    				})
                }

            });
            $scope.init();
        }
    ]);
});
