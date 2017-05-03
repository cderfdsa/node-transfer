/**我的评论-美妆商城                          控制器 依赖JS CSS
 * @param   {string} 'app'                    app.js
 * @param   {string} 'angular'                angular.min.js
 * @param   {string} 'cs!style'               style.css
 * @param   {string} 'cs!smCss'               sm.min.css
 * @param   {string} 'smJs'                   sm.min.js
 * @param   {string} 'pager'                  pager.js
 * @param   {string} 'lazyLoad'               lazyLoad.js
 * @param   {string} 'moment'                 moment.js
 */

define(['app', 'angular', 'moment', 'cs!style', 'cs!smCss', 'smJs', 'pager', 'lazyLoad','/common/directive/header/header.js', 'cs!static/css/userCenter/comment'], function(app, angular, moment) {

  /*定义 commentCtrl 控制器*/
  app.angular.controller('userCenter/commentCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    $.extend($scope, {
      init: function() {
        this.staticScope();
        this.initAjax();
      },

      /* 初始化静态 $scope */
      staticScope: function() {
        app.myApp.settitle($rootScope, '我的评论-美妆商城'); // 设置 title
        app.myApp.viewport("device"); // 设置viewport
      },

      /* 初始化动态数据 */
      initAjax: function() {
        $.pager({ // 用户消息列表
          $scope: $scope,
          lazyEle: '.lazy',
          scrollEle: '.content',
          data: {
            type: 2   // 消息类型: 0系统通知(没玩秘书) 1:用户关注 2：用户评论 3：用户送花
          },
          url: '/community/noticeList',
          callBack: function(res) {
            /* 转时间显示规则 */
            var now = new Date().getTime();

            $(res.data.rows).each(function(index, item) {
              var date = new Date(item.createdAt).getTime(),
                dvalDate = (now - date) / (60 * 60 * 1000);
              if (dvalDate < 1) item.createdAt = '刚刚';
              else if (1 <= dvalDate && dvalDate <= 24) item.createdAt = Math.floor(dvalDate) + '小时前';
              else item.createdAt = moment(item.createdAt).format('YYYY-MM-DD');
            });

            /* pager 回调 数据组装 */
            if ($scope.data) $scope.data.rows = $scope.data.rows.concat(res.data.rows);
            else $scope.data = res.data;
            $scope.$digest();
          }
        });
      },

      /* 跳转去帖子详情 */
      toCardDetail: function($index) {
        location.hash = '#/community/postPictureDetail/' + $scope.data.rows[$index].ref;
      }
    });

    $scope.init();

  }]);
});

// 接口和数据调整
