/**用户首页-美妆商城    						          控制器 依赖JS CSS
 * @param   {string} 'app'                  	app.js
 * @param   {string} 'angular'              	angular.min.js
 * @param   {string} 'cs!style'        			  style.css
 * @param   {string} 'cs!smCss'         		  sm.min.css
 * @param   {string} 'smJs'                 	sm.min.js
 * @param   {string} 'pager'                	pager.js
 * @param   {string} 'lazyLoad'               lazyLoad.js
 * @param   {string} 'moment'             	  moment.js
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
  'cs!static/css/community/home'
], function(app, angular, moment) {

  /*定义 homeCtrl 控制器*/
  app.angular.controller('community/homeCtrl', [
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
        this.titleScroll();
      },

      /* 初始化静态 $scope */
      staticScope: function() {
        app.myApp.settitle($rootScope, '用户首页-美妆商城'); // 设置 title
        app.myApp.viewport("device"); // 设置viewport

        // 判断是po图、笔记、全部
        $scope.type = /type=/g.test(location.hash) ? location.hash.split("type=")[1].split("&")[0] : null;
      },

      /* 初始化动态数据 */
      initAjax: function() {
        var self = this;


        app.myApp.ajax({ // 社区用户中心信息
          url: '/community/userCommunityStat',
          data: {
            memberId: $stateParams.id // 社区所属用户id
          }
        }, function(res) {
          if (!res.err) {
            $scope.userCommunityInfo = res.data;

            if (!$scope.userCommunityInfo.isSelf) { // 不是自己，关注按钮显示
              if ($scope.userCommunityInfo.isFollowed) // 已关注,默认未关注
                $(".userCenter_home_header .icon.pull-right").addClass("follow");
              $(".userCenter_home_header .icon.pull-right").show();
            }
            $scope.$digest();
          } else $.toast(res.errMsg);
        });


        $.pager({ // 帖子列表
          $scope: $scope,
          lazyEle: '.lazy',
          scrollEle: '.content',
          url: '/community/userCardList',
          data: {
            memberId: $stateParams.id, // 社区所属用户id
            type: $scope.type  // 0po图 1化妆笔记 null 全部
          },
          callBack: function(res) {
            /* 转时间显示规则 */
            var now = new Date().getTime();

            $(res.data.rows).each(function(index, item){
              var date = new Date(item.createdAt).getTime(),
                dvalDate = (now - date) / (60 * 60 * 1000);
              if (dvalDate < 1) item.createdAt = '刚刚';
              else if (1 <= dvalDate && dvalDate <= 24) item.createdAt = Math.floor(dvalDate) + '小时前';
              else item.createdAt = moment(item.createdAt).format('YYYY-MM-DD');
            });

            if ($scope.data) $scope.data.rows = $scope.data.rows.concat(res.data.rows);
            else $scope.data = res.data;
            $scope.$digest();
          }
        });
      },

      /* 标题滚动渐显 */
      titleScroll: function(){
        var opacity = 0;
        $(".content").scroll(function(){
          opacity = $(this).scrollTop()/176;
          if (opacity > 1) opacity = 1;
          $("header h1.title").css("opacity", opacity);
        });
      },

      /* 粉他/取消 */
      headRightFn: function(){
        var isFollowed = $scope.userCommunityInfo.isFollowed;

        app.myApp.ajax({
          url: ['/community/followSave', '/community/followCancel'][Number(isFollowed)],
          data: {
            parentId: $stateParams.id
          }
        }, function(res) {
          if (!res.err) {
            if (isFollowed)
              $(".userCenter_home_header .icon.pull-right").removeClass("follow");
            else
              $(".userCenter_home_header .icon.pull-right").addClass("follow");

            $scope.userCommunityInfo.isFollowed = !$scope.userCommunityInfo.isFollowed;
          } else $.toast(res.errMsg);
        });
      }
    });

    $scope.init();

  }]);
});
