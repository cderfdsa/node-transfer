/**女神说-美妆商城    						              控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'share'                share.js
 * @param   {string} 'moment'               moment.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'cs!sm-extendCss'      sm-extend.min.css
 * @param   {string} 'sm-extendJs'          sm-extend.min.js
 * @param   {string} 'pager'                pager.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 */

define([
  'app',
  'angular',
  'share',
  'moment',
  'cs!style',
  'cs!smCss',
  'smJs',
  'pager',
  'lazyLoad',
  'cs!sm-extendCss',
  'sm-extendJs',
  '/common/directive/header/header.js',
  '/common/directive/footer/footer.js',
  '/common/directive/tab/tab.js',
  '/common/directive/wow/wow.js',
  'cs!static/css/community/list'
], function(app, angular, share, moment) {

  /*定义 listCtrl 控制器*/
  app.angular.controller('community/listCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$http',
    function($rootScope, $scope, $state, $stateParams, $http) {

    $.extend($scope, {
        init: function() {
            this.staticScope();
            this.guideSwiper();
            this.headRightStatus();
            this.initAjax();
            this.getcardList();
            this.inputFooterStatus();
        },

        /* 初始化静态 $scope */
        staticScope: function() {
            app.myApp.settitle($rootScope, '女神说-美妆商城');   // 设置 title
            app.myApp.viewport("device");                       // 设置viewport
            $scope.tabActive = Number($stateParams.tab);        // 推荐（0）、最新（1）、关注（2
        },

        /*引导页滑动*/
        guideSwiper:function(){
          $(".swiper-guide").swiper({
              autoplayDisableOnInteraction:true, // Set to false and autoplay will not be disabled after user interactions
              pagination: '.swiper-pagination' //分页 class
            });
          $scope.FirstGuide =!localStorage.communityFirstGuide;
        },

        /*点击引导隐藏*/
        hideGuide:function(){
          localStorage.communityFirstGuide =true;
           $scope.FirstGuide =!localStorage.communityFirstGuide;
        },


        /* 初始化动态数据 */
        initAjax: function() {
            var self = this;

            if (!$scope.tabActive) {
              app.myApp.ajax({ // 头部 banner
                url: '/site/banner',
                data: {
                  type: 1
                }
              }, function(res) {
                if (!res.err) {
                  $scope.banners = res.data;
                  $scope.$digest();

                  self.initSwiper(); // 回调图片滑动插件
                } else $.toast(res.errMsg);
              });

              app.myApp.ajax({ // 热门话题列表
                url: '/community/topicHotList'
              }, function(res) {
                if (!res.err) {
                  $scope.hotTopics = res.data;
                  $scope.$digest();

                  $(".swiper-hotTopic").swiper({
                    slidesPerView: 2.5
                  });
                } else $.toast(res.errMsg);
              });
            }
          },

          /* 帖子列表 */
          getcardList: function() {
            if (app.myApp.iniValue.isLogin()) {
              app.myApp.ajax({ // 获取用户信息
                url: '/account/userInfo',
                loading: false
              }, function(res) {
                if (!res.err) {
                  $scope.userInfo = res.data; // 用于footer化妆笔记判断是否是大使
                } else $.toast(res.errMsg);
              });
            }

            var url = '/community/cardList',
              data = {recommand: !$scope.tabActive};

            if ($scope.tabActive == 2) {  // 用户关注帖子列表
              $scope.isLogin = app.myApp.iniValue.isLogin();
              if (!$scope.isLogin) return;
              url = '/community/followCardList';
              data = {token: $.getCookie("user_login_token")};
            }

            $.pager({
              $scope: $scope,
              lazyEle: '.lazy',
              scrollEle: '.content',
              repeatEle: '.postList',
              url: url,
              data: data,
              callBack: function(res) {
                  // moment转时间
                  var now  = new Date().getTime();

                  $(res.data.rows).each(function(index, item ){
                    var date = new Date(item.cardDetail.createdAt).getTime(),
                      dvalDate = (now - date) / (60 * 60 * 1000);
                    if (dvalDate < 1) item.cardDetail.createdAt = '刚刚';
                    else if (1 <= dvalDate && dvalDate < 24) item.cardDetail.createdAt = Math.floor(dvalDate) + '小时前';
                    else item.cardDetail.createdAt = moment(item.cardDetail.createdAt).format('YYYY-MM-DD');
                  });

                if ($scope.data) $scope.data.rows = $scope.data.rows.concat(res.data.rows);
                else $scope.data = res.data;
                $scope.$digest();
              }
            });
            return;
          },

          /* 初始化wow */
          initWow: function($index) {
            app.myApp.cnzz('wow');

            if (app.myApp.ifLogin() == false) return; // 未登录跳转去登陆

            if ($scope.data.rows[$index].cardDetail.hasWow) { // wow过了提示
              $.toast("你已经WOW过了哦~");
              return;
            }

            var wowValue = $scope.data.rows[$index].cardDetail.wowValue || 0;
            $.wow({
              success: function(index) {
                app.myApp.ajax({ // WOW
                  url: '/community/cardWow',
                  data: {
                    wow: index, // wow值
                    cardId: $scope.data.rows[$index].cardDetail._id // 帖子ID
                  }
                }, function(res) {
                  if (!res.err) {
                    $scope.data.rows[$index].cardDetail.wowValue = wowValue + index;
                    $scope.data.rows[$index].cardDetail.wow.count ++;
                    $scope.data.rows[$index].cardDetail.wow.rows.unshift({
                      memberId: $scope.userInfo.user.id,
                      memberInfo: {
                        headImg: $scope.userInfo.user.headImg
                      }
                    });
                    $scope.data.rows[$index].cardDetail.hasWow = true;
                    $scope.$digest();

                    if (res.data.missionTip) $.completeTaskModal(res.data.missionTip);
                    else $.toast("送wow成功~");

                    var $headImg = $(".tabContent").eq($scope.tabActive).find(".postList").eq($index).find(".flowers img").first();
                    $headImg.prop("src", $headImg.attr("lazySrc"));

                  } else $.toast(res.errMsg);
                });
              }
            });
          },

          /* banner 滑动插件 */
          initSwiper: function() {
            $(".swiper-banner").swiper({
              autoplay: 5000, // delay between transitions
              autoplayDisableOnInteraction: false, // Set to false and autoplay will not be disabled after user interactions
              pagination: '.swiper-pagination' //分页 class
            });
          },

          /* tab 切换回调 */
          tabMenuFn: function($index) {
            location.hash = '#/community/list/' + $index;
          },

          /* 跳转去帖子详情 */
          toCardDetail: function($index) {
            location.hash = '#/community/postPictureDetail/' + $scope.data.rows[$index].cardDetail._id;
          },

          /* 跳转去wow列表 */
          toWowList: function($index, $event) {
            $event.stopPropagation();
            location.hash = '#/community/wow/' + $scope.data.rows[$index].cardDetail._id;
          },

          /* 消息状态 显隐、新消息 */
          headRightStatus: function(){
            if (app.myApp.iniValue.isLogin()) {
                app.myApp.ajax({	//未读消息提醒
                  url:'/community/UnreadNoticeCount'
                },function(res){
                  if(!res.err){
                    if (res.data) {
                        $scope.msg = res.data > 9 ? 9 + '+' : res.data;
                        $(".community_list_header .icon.pull-right").append('<span>' + $scope.msg + '</span>');
                    }
                  } else $.toast(res.errMsg);
                })
            }
          },

          headRightFn: function(){
            var hash  = '#/userCenter/message/' + $scope.userInfo.user.id;
            if (app.myApp.ifLogin(hash) ==false) return;
            if ($scope.userInfo) location.hash = hash;
          },

          /* 微信分享 */
          wxShare: function($index, type) {
            var contentText;  // 取分享文字
            $($scope.data.rows[$index].cardDetail.content).each(function(index, item){
              if (item.type == 0) {
                contentText = item.data;
                return false;
              }
            });

            var shareTitle = "我通过任意门把美妆的时髦笔记分享给你",
              shareDesc = contentText || "点击更多惊喜哦~",
              shareImgUrl = "http://img.beautysite.cn" + $scope.data.rows[$index].cardDetail.image[0] + '!/fw/200',
              shareLink = location.origin + '/#/community/postDetailShare/' +
                          $scope.data.rows[$index].cardDetail._id,
              callback = {
                success: function() {
                  app.myApp.http($http, {
                    url: '/member/card/share',
                    data: {cardId: $scope.data.rows[$index].cardDetail._id}
                  }, function(res) {
                    if (res.data.missionTip) $.completeTaskModal(res.data.missionTip);
                    else $.toast("分享成功！");

                    $(".wxfx").remove();
                    app.myApp.recordShare($http, 0, 1);
                  });
                }
              };

            share.setContent(shareTitle, shareDesc, shareImgUrl, shareLink, callback);
            share.popupShare();

            $("body").delegate(".modal-overlay", "click", function() { // close tip modal
              $.closeModal();
            });
          },

          /* 粉TA */
          fanFn: function($index) {
            var hasFollowed = $scope.data.rows[$index].cardDetail.hasFollowed;

            if (!hasFollowed) app.myApp.cnzz('follow');

            app.myApp.ajax({
              url: ['/community/followSave', '/community/followCancel'][Number(hasFollowed)],
              data: {parentId: $scope.data.rows[$index].cardDetail.memberId}
            }, function(res) {
              if (!res.err) {
                $scope.data.rows[$index].cardDetail.hasFollowed = !$scope.data.rows[$index].cardDetail.hasFollowed;
                $scope.$digest();
              } else $.toast(res.errMsg);
            });
        },

        /*回复评论标记*/
        replay: function($parentIndex, $index, $event){
            $event.stopPropagation();

            if ($scope.data.rows[$parentIndex].commentList[$index].isSelf == 1) {
              $(document).on('open','.actions-modal', function () {
                  $('.actions-modal').addClass('actions_comment');
              });
              $.actions([
                [{
                  text: '删除',
                  onClick: function() {
                    app.myApp.http($http, {
                      url: '/member/card/comment/' + $scope.data.rows[$parentIndex].commentList[$index]._id + '/delete'
                    }, function(res) {
                      $scope.data.rows[$parentIndex].commentList.splice($index, 1);
                    })
                  }
                }],
                [{
                  text: '取消'
                }]
              ]);
            } else {
              $scope.data.rows[$parentIndex].commentType = 1;
              $scope.data.rows[$parentIndex].sourceId = $scope.data.rows[$parentIndex].commentList[$index].memberId;
              $scope.data.rows[$parentIndex].replayNickname = $scope.data.rows[$parentIndex].commentList[$index].member.nickName;
              $scope.data.rows[$index].addCommentText = '';
              $($event.target).parents('.comment').find('.sent input').focus();
            }
        },

        /*取消评论标记*/
        cancelReplay: function($index){
            $scope.data.rows[$index].commentType = 0;
            $scope.data.rows[$index].sourceId = undefined;
            $scope.data.rows[$index].replayNickname = undefined;
        },

        /* 键盘弹起和隐藏时底部 footer 状态 */
        inputFooterStatus: function(){
          $scope.windowHeight = $(window).height();

          var focusInputInterval = setInterval(function(){
            if ($(window).height() < $scope.windowHeight) {
              $(".footer").hide();
              $(".community_list").css('margin-bottom', 0);
            } else {
              $(".footer").show();
              $(".community_list").css('margin-bottom', '2.5rem');
            }
          }, 100)
        },

        /* 点击输入框 获得焦点 键盘弹起时 */
        focusInput: function($event) {
            var scrollDistence = $($event.target).offset().top - $scope.windowHeight/3;
            if (app.myApp.iniValue.isIos && $($event.target).offset().top > $scope.windowHeight/2) return;
            $('.content').scrollTop($('.content').scrollTop() + scrollDistence);
        },

        /* 帖子评论 */
        sentComment: function($index, $event){
            $event.stopPropagation();

            if (app.myApp.ifLogin(location.hash, location.hash) == false) return;

            if (!$scope.data.rows[$index].addCommentText) {
              $.toast('你还没有输入内容哦~');
              return;
            }

            app.myApp.http($http, {
                url: '/member/card/comment/save',
                data: {
                    cardId: $scope.data.rows[$index].cardDetail._id,    // 帖子id
                    type: $scope.data.rows[$index].commentType || 0,    // 类型(1是回复,0是评论)
                    content: $scope.data.rows[$index].addCommentText,   // 评论内容
                    sourceId: $scope.data.rows[$index].sourceId         // 被回复人id
                }
            }, function(res){
                if (res.data.missionTip) $.completeTaskModal(res.data.missionTip);
                $scope.data.rows[$index].commentList.unshift(res.data);
                $scope.data.rows[$index].cardDetail.commentNums ++;
                $scope.data.rows[$index].addCommentText = '';
            });
        }
    });

    $scope.init();
  }]);
});
