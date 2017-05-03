/**大师分销——收益明细 -美妆商城                                控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 */

define([
    'app',
    'angular',
    'cs!smCss',
    'cs!style',
    'smJs',
    'pager',
    '/common/directive/header/header.js',
    'cs!static/css/userCenter/ambCenter/incomeDetail'
], function(app, angular, moment) {

    /*定义 incomeDetailCtrl 控制器*/
    app.angular.controller('userCenter/ambCenter/incomeDetailCtrl', [
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
                    app.myApp.settitle($rootScope, '收益明细 -美妆商城');
                    app.myApp.viewport("device");
                },

                initAjax: function() {
                    switch (+$stateParams.type){
                        case 0 :
                            $scope.type="本人收益";
                            break;
                        case 1 :
                            $scope.type="高级任务返利";
                            break;
                        case 2 :
                            $scope.type="代言费";
                            break;
                        case 7 :
                            $scope.type="关联收益";
                            break;
                        case 8 :
                            $scope.type="邀请新用户";
                            break;
                        case 9:
                            $scope.type="邀请大使";
                            break;
                        default:
                            $scope.type = "收益明细";
                            break;
                    }
                    var data = {income: true};
                    if ($stateParams.type != undefined)
                        data.type = $stateParams.type;
                    if ($stateParams.frozen != undefined)
                        data.frozen = $stateParams.frozen;

                   $.pager({
                        $scope: $scope,
                        scrollEle: '.content',
                        url: '/member/money/income/list',
                        data: data,
                        http: $http,
                        method: 'GET'
                    });
                }
            });
            $scope.init();
        }
    ]);
});
