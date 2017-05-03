/**PO图-美妆商城    						            控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'fileUpload'           fileUpload.js
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */

define(['app', 'angular', 'cs!style', 'fileUpload', 'cs!smCss', 'smJs', '/common/directive/header/header.js', 'cs!static/css/community/postPicture'], function(app, angular) {

  /*定义 postPictureCtrl 控制器*/
  app.angular.controller('community/postPictureCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {

    $.extend($scope, {
      init: function() {
        this.staticScope();
        this.initAjax();
        this.initUploadFile();
      },

      /* 初始化静态 $scope */
      staticScope: function() {
        app.myApp.settitle($rootScope, 'PO图-美妆商城'); // 设置 title
        app.myApp.viewport("device"); // 设置viewport

        $scope.community_addTags = JSON.parse(localStorage.community_addTags || '[]');  // 标签
        $scope.viewImgUrl = localStorage.postPicture_viewImgUrl || '';
        $scope.textareas = localStorage.postPicture_textareas || '';
        localStorage.removeItem('postPicture_textareas');
        localStorage.removeItem('postPicture_viewImgUrl');
      },

      /* 初始化动态数据 */
      initAjax: function() {
        var self = this;

        // app.myApp.ajax({ // PO图编辑
        //   url: ''
        // }, function(res) {
        //   if (!res.err) {
        //     $scope.po = res.data;
        //     $scope.$digest();
        //   } else $.toast(res.errMsg);
        // });
      },

      /*限制textarea1000字符*/
      limitTextLength: function() {
        if ($scope.textareas.length > 1000) $scope.textareas = $scope.textareas.substring(0, 1000);
      },

      /* init uploadFile */
      initUploadFile: function(){
        $(".imgBox").fileUpload({
          remotePath: '/community',
          callback: function(res){
            $scope.viewImgUrl = app.myApp.iniValue.isWeiXin ? res.data : res.data.img;
            $scope.$digest();
            $.toast("上传成功~");
          },
          actions: true
        });
      },

      /* 添加标签 */
      toAddTags: function() {
        localStorage.postPicture_textareas = $scope.textareas;
        localStorage.postPicture_viewImgUrl = $scope.viewImgUrl;
        location.href = '#/community/addTags/0';
      },

      /* 取消 */
      headLeftFn: function() {
        $.modal({
          text: '取消后就无法保存哦，要放弃编辑吗？',
          buttons: [{
            text: '放弃',
            onClick: function() {
              localStorage.removeItem("community_addTags");
              location.href = '#/community/list/0';
            }
          }, {
            text: '再等等'
          }, ]
        });
      },

      /* 发布 */
      headRightFn: function() {
        app.myApp.cnzz('potu');

        if (!$scope.viewImgUrl) {
          $.toast('还没有上传图片哦~');
          return;
        }

        if ($scope.send) return;
        $scope.send = true;

        app.myApp.ajax({
          url: '/community/cardAdd',
          data: {
            img: [$scope.viewImgUrl],
            content: [{
              type: 0,  // 类型(0:文字 1:图片 2:商品)
              data: $scope.textareas  // data:内容
            }],
            tags: $scope.community_addTags
          }
        }, function(res) {
          $scope.send = false;
          if (!res.err) {
            if (res.data.missionTip)
              $.completeTaskModal(res.data.missionTip);

            localStorage.removeItem("community_addTags");
            location.href = '#/community/list/1';
          } else $.toast(res.errMsg);
        });
      }

    });

    $scope.init();

  }]);
});
