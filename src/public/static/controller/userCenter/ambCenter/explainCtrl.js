/**大使分销——规则说明页 -美妆商城             控制器 依赖JS CSS
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
    'cs!static/css/userCenter/ambCenter/explain'
], function(app, angular, moment) {

    /*定义 incomeDetailCtrl 控制器*/
    app.angular.controller('userCenter/ambCenter/explainCtrl', ['$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$http',
        function($rootScope, $scope, $state, $stateParams, $http) {

            $.extend($scope, {
                init: function() {
                    this.staticScope();
                },

                staticScope: function() {
                    /*设置标题*/
                    app.myApp.settitle($rootScope, '玩转校园大使 -美妆商城');
                    app.myApp.viewport("device");
                    $scope.domain = $domain;
                },
            });

            $scope.init();
        }
    ]);
});
