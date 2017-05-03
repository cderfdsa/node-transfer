/**使用红包-美妆商城    					控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 */

define([
    'app',
    'angular',
    'cs!style',
    'cs!smCss',
    'smJs',
    '/common/directive/header/header.js',
    'cs!static/css/order/coupons'
], function(app, angular) {

    /*定义 order/couponsCtrl 控制器*/
     app.angular.controller('order/couponsCtrl', [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$http',
        function($rootScope, $scope, $state, $stateParams, $http) {
            $.extend($scope, {
                init: function(){
                    this.staticScope();
                    this.getUserBonus();
                },

                staticScope: function(){
                    app.myApp.settitle($rootScope, '红包-美妆商城');
                    app.myApp.viewport("device");
                },

                getUserBonus: function($index){
                    app.myApp.http($http, {
                        url: '/member/coupons',
                        method: 'GET',
                        data: {orderId: $stateParams.orderId}
                    }, function(res){
                        $scope.data = res.data;
                        if ($rootScope.orderCouponsSelect) {
                            if ($rootScope.orderCouponsSelect.id == 'none')
                                $scope.noneChecked = true;
                            else {
                                $($scope.data).each(function(index, item) {
                                    if ($rootScope.orderCouponsSelect.id = item.id)
                                        item.checked = true;
                                });

                            }
                       } else $scope.data[0].checked = true;
                    });
                },

                /* check radio callback*/
                checkCoupons: function($index){
                    $($scope.data).each(function(index, item) {
                        item.checked = false;
                    });
                    $scope.noneChecked = false;

                    if ($index == 'none') $scope.noneChecked = true;    // 不使用红包
                    else $scope.data[$index].checked = true;    // 使用红包
                },

                /* submit coupons */
                submitCoupons: function(){
                    if ( $scope.noneChecked) {
                        $rootScope.orderCouponsSelect = {
                            id: 'none',
                            value: 0
                        };
                    } else {
                        $($scope.data).each(function(index, item) {
                            if (item.checked) {
                                $rootScope.orderCouponsSelect = item;
                            }
                        });
                    }
                    history.back();
                }
            });

            $scope.init();

        }
    ]);
});