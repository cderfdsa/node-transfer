/**添加标签-美妆商城    						        控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */

define(['app', 'angular', 'cs!style', 'cs!smCss', 'smJs', '/common/directive/header/header.js', 'cs!static/css/community/addTags'], function(app, angular) {

  /*定义 addTagsCtrl 控制器*/
  app.angular.controller('community/addTagsCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {

    $.extend($scope, {
      init: function() {
        this.staticScope();
        this.initAjax();
        this.addBtnClass();
      },

      /* 初始化静态 $scope */
      staticScope: function() {
        app.myApp.settitle($rootScope, '添加标签-美妆商城'); // 设置 title
        app.myApp.viewport("device"); // 设置viewport

        $scope.addTags = JSON.parse(localStorage.community_addTags || '[]');
      },

      /* 初始化动态数据 */
      initAjax: function() {
        app.myApp.ajax({ // 热门标签
          url: '/community/TagHot'
        }, function(res) {
          if (!res.err) {
            $scope.hotTags = res.data;
            $scope.$digest();
          } else $.toast(res.message);
        });
      },

      /* limit edit tag's length */
      limitLength: function(){
        if ($scope.tag.length > 10) {
          $scope.tag = $scope.tag.substring(0, 10);
          $.toast('最多输入10个字哦~', 1000);
        }
      },

      /* 添加标签 */
      addTagsFn: function(tag, type){
        if ($scope.addTags.length >= 5) {
          $.toast('标签最多只能添加5个哦~');
          return;
        }

        if (!type && !$.trim(tag)) {
          $.toast('标签内容为空哦~');
          return;
        }

        $scope.tag = '';

        if ($scope.addTags.indexOf(tag) > -1) {
          $.toast('已经添加过了哦~');
          return;
        }

        $scope.addTags.unshift(tag);

        this.addBtnClass();
      },

      /* 添加button class */
      addBtnClass: function(){
        if ($scope.addTags.length >= 5) return '';
        else return 'active';
      },

      /* 标签删除 */
      deleteTag: function($index){
        $.modal({
          text: '删除就追不回来了哦，确定删除吗？',
          buttons: [
            {
              text: '确定',
              onClick: function() {
                $scope.addTags.splice($index, 1);
                $scope.$digest();
              }
            },
            {
              text: '取消'
            },
          ]
        });
      },

      /* 编辑回退 */
      headLeftFn: function(){
        if (!$scope.addTags.length) {
          history.back();
          return;
        }

        $.modal({
          text: '取消后就无法保存哦，要放弃编辑吗？',
          buttons: [
            {
              text: '放弃',
              onClick: function() {
                location.href = ['#/community/postPicture', '#/community/note'][$stateParams.type];//兼容回退不了的bug
              }
            },
            {
              text: '再等等'
            },
          ]
        });
      },

      /* 标签跳转到po图/化妆笔记 */
      headRightFn: function(){
        localStorage.community_addTags = JSON.stringify($scope.addTags);
        location.href = ['#/community/postPicture', '#/community/note'][$stateParams.type];
      }
    });

    $scope.init();

  }]);
});
