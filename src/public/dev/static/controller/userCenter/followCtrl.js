/**关注-美妆商城                              控制器 依赖JS CSS
 * @param   {string} 'app'                    app.js
 * @param   {string} 'angular'                angular.min.js
 * @param   {string} 'cs!style'               style.css
 * @param   {string} 'cs!smCss'               sm.min.css
 * @param   {string} 'smJs'                   sm.min.js
 * @param   {string} 'pager'                  pager.js
 * @param   {string} 'lazyLoad'               lazyLoad.js
 * @param   {string} 'moment'                 moment.js
 */

define(['app', 'angular', 'moment', 'cs!style', 'cs!smCss', 'smJs', 'pager', 'lazyLoad', '/common/directive/header/header.js', 'cs!static/css/userCenter/follow'], function(app, angular, moment) {

  /*定义 fansCtrl 控制器*/
  app.angular.controller('userCenter/followCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    $.extend($scope, {
      init: function() {
        this.staticScope();
        this.initAjax();
      },

      /* 初始化静态 $scope */
      staticScope: function() {
        app.myApp.settitle($rootScope, '关注-美妆商城'); // 设置 title
        app.myApp.viewport("device"); // 设置viewport

        $scope.isSelf = Number($stateParams.isSelf);  // 是自己的粉丝列表还是别人的
      },

      /* 初始化动态数据 */
      initAjax: function() {
        var self = this;

        $.pager({ // 用户关注列表
          $scope: $scope,
          lazyEle: '.lazy',
          scrollEle: '.content',
          url: '/community/followList',
          data: {memberId: $stateParams.memberId}  //要查看的用户Id
        });
      },

      actions: function($index){
        var self = this;
        if ($scope.isSelf) {
          $.actions([
            [{
              text: '不再关注',
              onClick: function() {
                self.fanFn($index);
              }
            }],
            [{
              text: '取消'
            }]
          ]);
        } else self.fanFn($index);
      },

      /* 粉TA */
      fanFn: function($index) {
        var isFollowed = $scope.data.rows[$index].isFollowed;

        if (!isFollowed) app.myApp.cnzz('follow');

        app.myApp.ajax({
          url: ['/community/followSave', '/community/followCancel'][Number(isFollowed)],
          data: {
            parentId: $scope.data.rows[$index].parentId
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
