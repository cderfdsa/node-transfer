/**粉丝-美妆商城                              控制器 依赖JS CSS
 * @param   {string} 'app'                    app.js
 * @param   {string} 'angular'                angular.min.js
 * @param   {string} 'cs!style'               style.css
 * @param   {string} 'cs!smCss'               sm.min.css
 * @param   {string} 'smJs'                   sm.min.js
 * @param   {string} 'pager'                  pager.js
 * @param   {string} 'lazyLoad'               lazyLoad.js
 * @param   {string} 'moment'                 moment.js
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
  'cs!static/css/userCenter/fans'
], function(app, angular, moment) {

  /*定义 fansCtrl 控制器*/
  app.angular.controller('userCenter/fansCtrl', [
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

      /* 初始化静态 $scope */
      staticScope: function() {
        $scope.showDate = /date=true/g.test(location.hash); // 最新显示时间
        $scope.title = $scope.showDate ? '新粉丝' : '粉丝';
        $scope.isSelf = Number($stateParams.isSelf);  // 是自己的粉丝列表还是别人的

        app.myApp.settitle($rootScope, $scope.title + '-美妆商城'); // 设置 title
        app.myApp.viewport("device"); // 设置viewport
      },

      /* 初始化动态数据 */
      initAjax: function() {
        var url, data;
        if ($scope.showDate) {  // 用户消息-新粉丝
          url = '/community/noticeList';
          data = {type: 1};
        } else {  // 粉丝列表（别人和自己）
          url = '/community/fansList';
          data = {memberId: $stateParams.memberId};  //要查看的用户Id
        }

        $.pager({ // 用户粉丝列表
          $scope: $scope,
          lazyEle: '.lazy',
          scrollEle: '.content',
          url: url,
          data: data,
          callBack: function(res) {
            /* 转时间显示规则 */
            var now = new Date().getTime();

            $(res.data.rows).each(function(index, item) {
              var date = new Date(item.createdAt).getTime(),
                dvalDate = (now - date) / (60 * 60 * 1000);
              if (dvalDate < 1) item.createdAt = '刚刚';
              else if (1 <= dvalDate && dvalDate < 24) item.createdAt = Math.floor(dvalDate) + '小时前';
              else item.createdAt = moment(item.createdAt).format('YYYY-MM-DD');
            });

            /* pager 回调 数据组装 */
            if ($scope.data) $scope.data.rows = $scope.data.rows.concat(res.data.rows);
            else $scope.data = res.data;
            $scope.$digest();
          }
        });
      },

      /* 粉TA */
      fanFn: function($index) {
        var isFollowed = $scope.data.rows[$index].isFollowed;

        if (!isFollowed) app.myApp.cnzz('follow');

        app.myApp.ajax({
          url: ['/community/followSave', '/community/followCancel'][Number(isFollowed)],
          data: {
            parentId: $scope.data.rows[$index].memberId
          }
        }, function(res) {
          if (!res.err) {
            $scope.data.rows[$index].isFollowed = !$scope.data.rows[$index].isFollowed;
            $scope.$digest();
          } else $.toast(res.errMsg);
        });
      }
    });

    $scope.init();

  }]);
});
