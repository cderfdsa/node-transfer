/**大使分销——业绩明细 -美妆商城             控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 */

define(['app',
    'angular',
    'cs!style',
    'cs!smCss',
    'smJs',
    'pager',
    '/common/directive/header/header.js',
    'cs!static/css/userCenter/ambCenter/achievementDetail'
], function(app, angular, moment) {

    /*定义 incomeDetailCtrl 控制器*/
    app.angular.controller('userCenter/ambCenter/achievementDetailCtrl', [
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
                    app.myApp.settitle($rootScope, '业绩明细 -美妆商城');
                    app.myApp.viewport("device");
                },

                initAjax: function() {
                    switch ($stateParams.type){
                        case 0 :
                            $scope.type="本人业绩";
                            break;
                        case 1 :
                            $scope.type="邀请大使业绩";
                            break;
                        case 2 :
                            $scope.type="关联业绩";
                            break;
                        default:
                            $scope.type="业绩明细"
                    }
                    var data = {};
                    if ($stateParams.type != undefined)
                        data.type = $stateParams.type;
                    if ($stateParams.frozen != undefined)
                        data.frozen = $stateParams.frozen;
                    $.pager({
                        $scope: $scope,
                        scrollEle: '.content',
                        url: '/member/exploit/list',
                        http: $http,
                        data: data,
                        method: 'GET'
                    });
                },
            });

            $scope.init();
        }
    ]);
});