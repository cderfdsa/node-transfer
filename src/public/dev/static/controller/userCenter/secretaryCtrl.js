/**美妆秘书-美妆商城    						          控制器 依赖JS CSS
 * @param   {string} 'app'                  	app.js
 * @param   {string} 'angular'              	angular.min.js
 * @param   {string} 'cs!style'        			  style.css
 * @param   {string} 'cs!smCss'         		  sm.min.css
 * @param   {string} 'smJs'                   sm.min.js
 * @param   {string} 'moment'                 moment.min.js
 */

define(['app', 'angular', 'moment', 'cs!style', 'cs!smCss', 'smJs', '/common/directive/header/header.js', 'cs!static/css/userCenter/secretary'], function(app, angular, moment) {

  /*定义 secretaryCtrl 控制器*/
  app.angular.controller('userCenter/secretaryCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {

    $.extend($scope, {
      init: function() {
        this.staticScope();
        this.initAjax();
      },

      /* 初始化静态 $scope */
      staticScope: function() {
        $scope.title = ['公告列表', '美妆秘书'][$stateParams.type];

        app.myApp.settitle($rootScope, $scope.title + '-美妆商城'); // 设置 title
        app.myApp.viewport("device"); // 设置viewport
      },

      initAjax: function() {
        var self = this;
        app.myApp.ajax({
          url: '/community/noticeList',
          data:{
                type: $stateParams.type - 1
          }
        }, function(res) {
          if (!res.err) {
            $(res.data.rows).each(function(index, item) {
              // 转时间
              item.time = moment().diff(moment(item.createdAt), "hours", true);
              if (item.time < 1) {
                item.createdAt = "刚刚";
              } else if (item.time >= 1 && item.time < 24) {
                item.createdAt = parseInt(item.time) + "小时前";
              } else if (item.time >= 24) {
                item.createdAt = moment(item.createdAt).format("YYYY-MM-DD");
              }
            });

            $scope.data = res.data;
            $scope.$digest();
          } else $.toast(res.errMsg)
        })
      },

      /*点击跳转到自带链接/秘书详情*/
      jump: function($index) {
        var link;
        if (!$scope.data.rows[$index].link) { // 没有链接
          if ($scope.data.rows[$index].remark.length <= 72) return; // 72个字以内不跳转
          link = "#/userCenter/secretaryDetail";
          $rootScope.secretaryDetail_remark = $scope.data.rows[$index].remark;
        } else link = $scope.data.rows[$index].link; // 有链接
        location.href = link;
      }
    });

    $scope.init();

  }]);
});