/**代言笔记-美妆商城                        控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'fileUpload'           fileUpload.js
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'touch'                touch.min.js
 */

define([
  'app',
  'angular',
  'cs!style',
  'fileUpload',
  'cs!smCss',
  'smJs',
  'touch',
  '/common/directive/header/header.js',
  '/common/directive/tab/tab.js',
  'cs!static/css/community/note'
], function(app, angular) {

  /*定义 postPictureCtrl 控制器*/
  app.angular.controller('community/noteCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$http',
    '$timeout',
    function($rootScope, $scope, $state, $stateParams, $http, $timeout) {

      $.extend($scope, {
        init: function() {
          this.staticScope();
          this.initAjax();
          this.guide();
          this.swipeFooter();
          this.loadTextarea();
          this.tabMenuFn();
          this.initUploadFile();
        },

        /* 初始化静态 $scope */
        staticScope: function() {
          app.myApp.settitle($rootScope, '代言笔记-美妆商城'); // 设置 title
          app.myApp.viewport("device"); // 设置viewport

          $scope.storageToScope();

          if ($rootScope.community_noteGoods) { // 商品信息
            $scope.editContentFn($rootScope.community_noteGoods, 2);
            $rootScope.community_noteGoods = null;
          }
        },

        /* 初始化动态数据 */
        initAjax: function() {
          // var self = this;

          // app.myApp.ajax({ // PO图编辑
          //   url: ''
          // }, function(res) {
          //   if (!res.err) {
          //     $scope.po = res.data;
          //     $scope.$digest();
          //   } else $.toast(res.errMsg);
          // });
        },

        /* 第一次进入弹出引导页 */
        guide: function(){
          if (!localStorage.nodeGuideModal) {
            $.modal({
              text: '<img src="/static/img/community/note_guide.png">',
              afterText:'<img src="/static/img/community/add_goods.png">',
              extraClass: 'modal-nodeGuide'
            });
            localStorage.nodeGuideModal = true;

            $("body").on("click", ".modal-overlay, .modal-nodeGuide", function(){
              $.closeModal();
            });
          }
        },

        /* init taxtarea height */
        loadTextarea: function() {
          $timeout(function() {
            $("textarea").map(function() {
              $(this).height(this.scrollHeight);
            });
            if ($scope.community_editContent.length)
              $(".content").scrollTop($("textarea").eq($("textarea").length - 1).offset().top + $(".content").scrollTop());
          }, 200);
        },

        /* tab标签切换 */
        tabMenuFn: function($index) {
          $scope.tabActive = $index != undefined ? $index : $scope.tabActive;
        },

        /* 上滑下滑显隐 */
        swipeFooter: function(){
          $(".content").swipeUp(function() {
            $scope.hideFooterClass = 'show';
            $scope.$digest();
          });

          $(".content").swipeDown(function() {
            $scope.hideFooterClass = 'hide';
            $scope.$digest();
          });
        },

        /* textarea 限制 1000字符 高度自适应 */
        limitTextLength: function($index) {
          var $textarea = $("textarea"),
            $editTextarea = $(".editItem").eq($index).find("textarea");

          if ($index == undefined) {
            $scope.textareas = $scope.textareas.substring(0, 1000);
            $textarea.last().height("auto")
              .height($textarea.last()[0].scrollHeight);
          } else {
            $scope.community_editContent[$index].data.substring(0, 1000);
            $editTextarea.height("auto").height($editTextarea[0].scrollHeight);
          }
          $(".content").scrollTop($textarea.last().offset().top + $(".content").scrollTop() + $textarea.height());
        },

        /* textarea 编辑时的位置 */
        focusTextarea: function($event) {
          $event.stopPropagation();

          $timeout(function() {
            $(".content").scrollTop($($event.target).offset().top + $(".content").scrollTop() - 100);
          }, 500);
        },

        /* init uploadFile */
        initUploadFile: function(){
          $scope.uploadFiles = $(".upload").fileUpload({
            remotePath: '/community',
            callback: $scope.imgUploadSucc
          });

          $(".upload").on("click", function(){
            $scope.imgIndex = $(this).data("imgindex");
          });
        },

        /* 更换图片 actions */
        actionsPic: function() {
          var self = this;
          if (app.myApp.iniValue.isWeiXin) {
            $.actions([
              [{
                text: '更换照片',
                onClick: function() {
                  $scope.uploadFiles.wxImage();
                }
              }],
              [{
                text: '取消'
              }]
            ]);
          }
        },

        /* file upload success callback */
        imgUploadSucc: function(res) {
          var img = app.myApp.iniValue.isWeiXin ? res.data : res.data.img;

          if ($scope.imgIndex == 3) { //  edit content
            if ($scope.textareas) $scope.editContentFn($scope.textareas, 0);
            $scope.textareas = '';
            $scope.textareas = null;
            $scope.editContentFn(img, 1);
          } else {
            $scope.community_viewImgUrl[$scope.imgIndex] = img;
          }
          $scope.$digest();
          $.toast("上传成功~");

        },

        /**edit content                       编辑笔记区域
         * @param   {string} type              0/1/2 (文字/图片/商品)
         * @param   {string/number} item       字符串/数字 (新增内容/删除的数组指针)
         */
        editContentFn: function(item, type) {
          if (typeof item == "number") {  // delete
            $.confirm('删除就追不回来了哦，确定要删除吗？', function() {
              $scope.community_editContent.splice(item, 1);
              $scope.$digest();
            });
          } else { // add
            $scope.community_editContent.push({
              data: item,
              type: type
            });
          }

          $("textarea").last().click();
        },

        /* 添加标签 */
        toAddTags: function() {
          $scope.scopeToStorage();
          location.href = '#/community/addTags/1?tags=' +
            encodeURIComponent($scope.community_addTags);
        },

        /*增加商品*/
        tobeautyGoods: function() {
          if ($scope.textareas) $scope.editContentFn($scope.textareas, 0);
          $scope.textareas = '';
          $scope.scopeToStorage();

          location.hash = '#/community/beautyGoods';
        },

        /* 取消 */
        headLeftFn: function() {
          if (!$scope.community_editContent.length && !$scope.textareas) {
            location.hash = '#/community/list/0';
            return;
          }

          $.actions([
            [{
              text: '清空并退出',
              onClick: function() {
                $scope.storageToScope();
                location.hash = '#/community/list/0';
              }
            }],
            [{
              text: '保存并退出',
              onClick: function() {
                $scope.scopeToStorage();
                location.hash = '#/community/list/0';
              }
            }],
            [{
              text: '取消'
            }]
          ]);
        },

        /* 保存 localStorage 数据 */
        scopeToStorage: function() {
          localStorage.community_viewImgUrl = JSON.stringify($scope.community_viewImgUrl);
          localStorage.community_addTags = JSON.stringify($scope.community_addTags);
          localStorage.community_editContent = JSON.stringify($scope.community_editContent);
          localStorage.community_tabIndex = JSON.stringify($scope.tabActive || 0);
        },

        /* 清空 localStorage 数据 */
        storageToScope: function() {
          $scope.community_viewImgUrl = JSON.parse(localStorage.community_viewImgUrl || '[]'); // 对比图
          $scope.community_addTags = JSON.parse(localStorage.community_addTags || '[]'); // 标签
          $scope.community_editContent = JSON.parse(localStorage.community_editContent || '[]'); // 编辑数据
          $scope.tabActive = JSON.parse(localStorage.community_tabIndex || '0'); // tab

          localStorage.removeItem('community_viewImgUrl');
          localStorage.removeItem('community_addTags');
          localStorage.removeItem('community_editContent');
          localStorage.removeItem('community_tabIndex');
        },

        /* 发布 */
        headRightFn: function() {
          app.myApp.cnzz('note');

          if (!$scope.tabActive) {
            if (!$scope.community_viewImgUrl[0] && !$scope.community_viewImgUrl[1]) {
              $.toast('封面不能为空哦~');
              return;
            }
            if (!$scope.community_viewImgUrl[0] || !$scope.community_viewImgUrl[1]) {
              $.toast('对比封面需要两张图片哦~');
              return;
            }
          }

          if ($scope.tabActive && !$scope.community_viewImgUrl[2]) {
            $.toast('封面不能为空哦~');
            return;
          }

          if (!$scope.community_addTags.length) {
            $.toast('标签不能为空哦~');
            return;
          }

          var type0Length = 0,
            type1Length = 0,
            content = [];
          if ($scope.textareas) { // 正在编辑的textarea
            $scope.editContentFn($scope.textareas, 0);
            $scope.textareas = '';
            type0Length ++;
          }
          $($scope.community_editContent).each(function(index, item) {
            if (item.type == 0) type0Length++;
            if (item.type == 1) type1Length++;
            content.push({
              data: item.type == 2 ? item.data._id : item.data, // 商品只传id
              type: item.type
            });
          });

          if (!type0Length) {
            $.toast('笔记需要添加文字哦~');
            return;
          }

          if (!type1Length) {
            $.toast('笔记需要添加图片哦~');
            return;
          }

          if ($scope.send) return;
          $scope.send = true;
          app.myApp.ajax({
            url: '/community/cardAdd',
            data: {
              img: !$scope.tabActive ? $scope.community_viewImgUrl.slice(0, 2) : $scope.community_viewImgUrl.slice(2, 3),
              content: content,
              tags: $scope.community_addTags, // 标签
              type: 1 // 类型(默认po图,1化妆笔记)
            }
          }, function(res) {
            $scope.send = false;
            if (!res.err) {
              if (res.data.missionTip)
                $.completeTaskModal(res.data.missionTip);
              $scope.storageToScope();
              location.href = '#/community/list/1';
            } else $.toast(res.errMsg);
          });
        }

      });

      $scope.init();
    }
  ]);
});