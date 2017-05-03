/**订单详情-美妆商城                            控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */

define(['app', 'angular', 'cs!smCss', 'smJs', '/common/directive/header/header.js', 'cs!static/css/userCenter/orderDetail'], function(app, angular) {

  /*定义 orderDetailCtrl 控制器*/
  app.angular.controller('userCenter/orderDetailCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    /*设置标题*/
    app.myApp.settitle($rootScope, '订单详情-美妆商城');
    app.myApp.viewport("device");
    $scope.type = $stateParams.type;
    $scope.value = $stateParams.value;
    /*初始化数据渲染*/
    app.myApp.http($http,{
      url:'/member/mymember/order/'+ $stateParams.id +'/detail',
       method: 'GET',
      data:{
         type:$scope.type
      }
    }, function(res) {
      if (!res.err) {
        // 订单状态
        if (res.data.status == 6) {
          res.data.statusText = "已收货";
        } else if (res.data.status > 0 && res.data.status < 6) {
          res.data.statusText = "待收货";
        } else if (res.data.status == 0) {
          res.data.statusText = "待支付";
        } else if (res.data.status < 0 && res.data.status > -3) {
          res.data.statusText = "已关闭";
        } else if (res.data.status == -3) {
          res.data.statusText = "退款中";
        } else if (res.data.status == -4) {
          res.data.statusText = "已退款";
        }

        $scope.data = res.data;
      } else $.toast(res.errMsg);
    })

  }]);
});