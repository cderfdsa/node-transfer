/**推广海报-美妆商城                        控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/style'         style.css
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
    'cs!static/css/userCenter/ambCenter/poster'
], function(app, angular) {

    /* define userCenter/ambCenter/posterCtrl controller */
    app.angular.controller('userCenter/ambCenter/posterCtrl', [
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
                app.myApp.settitle($rootScope, '推广海报-美妆商城');  // set title
                app.myApp.viewport("device");   // set viewport
            },

            /* get initialize data */
            initAjax: function() {
                app.myApp.http($http, { // 大使海报
                    url: '/member/poster',
                    method: 'GET'
                }, function(res){
                    $scope.postDownloadUrl = res.data + '?time=' + new Date().getTime();
                })

            }
        });

        $scope.init();
    }]);

});
