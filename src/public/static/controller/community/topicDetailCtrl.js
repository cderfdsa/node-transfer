/**话题详情-美妆商城                        控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */

define([
    'app',
    'angular',
    'share',
    'cs!style',
    'cs!smCss',
    'pager',
    'lazyLoad',
    'smJs',
    'cs!sm-extendCss',
    'sm-extendJs',
    '/common/directive/footer/footer.js',
    '/common/directive/wow/wow.js',
    '/common/directive/header/header.js',
    'cs!static/css/community/topicDetail'
], function(app, angular, share) {
    /*定义 topicDetailCtrl 控制器*/
    app.angular.controller('community/topicDetailCtrl', [
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
                this.swipeUp();
                this.swipeDown();
                this.titleScroll();
            },
            /* 初始化静态 $scope */
            staticScope: function() {
                app.myApp.settitle($rootScope, '话题详情-美妆商城'); // 设置 title
                app.myApp.viewport("device"); // 设置viewport
                $scope.domain = $domain; // 设置 domain
                $scope.hideNav =true;
            },

            /*上滑*/
            swipeUp:function(){
                $(".content").swipeUp(function(){
                    $scope.hideNav = true;
                    $scope.$digest();
                })
            },
            // 下滑
            swipeDown:function(){
                 $(".content").swipeDown(function(){
                   $scope.hideNav = false;
                   $scope.$digest();
                })
            },

            /* 初始化动态数据 */
            initAjax: function() {
                var self = this;
                // 获取话题详情
                app.myApp.ajax({
                    url: '/community/TopicDetail',
                    data: {
                        name: $stateParams.name
                    }
                }, function(res) {
                    if (!res.err) {
                        $scope.topicDetail = res.data;
                        self.getTopicList();
                    } else {
                        $.toast("帖子不存在或已删除");
                        setTimeout(function(){
                            history.go(-1);
                        },2000)
                    }
                     $scope.$digest();
                });

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
            },

            /* 标题滚动渐显 */
            titleScroll: function() {
                var opacity = 0;
                $(".content").scroll(function() {
                    opacity = $(this).scrollTop() / 176;
                    if (opacity > 1) opacity = 1;
                    $("header h1.title").css("opacity", opacity);
                });
            },

            /*帖子列表*/
            getTopicList: function() {
                $.pager({
                    $scope: $scope,
                    lazyEle: ".lazy",
                    scrollEle: '.content',
                    url: '/community/cardList',
                    data: {
                        tagName: $scope.topicDetail.name
                    },
                    callBack: function(res) {
                        if ($scope.data) $scope.data.rows = $scope.data.rows.concat(res.data.rows);
                        else $scope.data = res.data;
                        $scope.$digest();
                    }
                })
            },
             /*话题订阅*/
            subscribe:function(){   //hasSubscribe=true 已订阅 false 未订阅
                if (app.myApp.ifLogin() == false) return; // 未登录跳转去登陆
                if($scope.topicDetail.hasSubscribe){
                    app.myApp.ajax({    //取消订阅
                        url:'/community/unSubscribe',
                        data:{
                            tagName:$scope.topicDetail.name
                        }
                    },function(res){
                        if(!res.err){
                           $scope.topicDetail.hasSubscribe=false;
                            $scope.$digest()
                        }else $.toast(res.errMsg)
                    })
                }else{
                    app.myApp.ajax({    //订阅
                        url:'/community/subscribe',
                        data:{
                            tagName:$scope.topicDetail.name
                        }
                    },function(res){
                        if(!res.err){
                            $scope.topicDetail.hasSubscribe=true;
                            $scope.$digest()
                        }else $.toast(res.errMsg)
                    })
                }
            },

            /* 微信分享 */
            wxShare: function($index, type) {
                app.myApp.cnzz('cardShare');

                if (($scope.data.rows[$index].cardDetail.isSelf || $scope.userInfo.user.adminLevel) && !type) { // 是否是管理员或者自己
                  $scope.data.rows[$index].cardDetail.moreAct = !$scope.data.rows[$index].cardDetail.moreAct;
                  return;
                }
                var contentText;  // 取分享文字
                $($scope.data.rows[$index].cardDetail.content).each(function(index, item){
                  if (item.type == 0) {
                    contentText = item.data;
                    return false;
                  }
                });
                var shareTitle = "我通过任意门把美妆的时髦笔记分享给你",
                    shareDesc = contentText || "点击更多惊喜哦~",
                    shareImgUrl = "http://img.beautysite.cn" + $scope.data.rows[$index].cardDetail.image[0]+'!/fw/200',
                    shareLink = location.href,
                    callback = {
                        success: function() {
                            app.myApp.http($http, {
                                url: '/member/card/share',
                                data: {cardId: $scope.data.rows[$index].cardDetail._id}
                            }, function(res) {
                                if (res.data.missionTip) $.completeTaskModal(res.data.missionTip);
                                else $.toast("分享成功！");

                                $(".wxfx").remove();
                                app.myApp.recordShare($http, 0, 2);
                            });
                        }
                    };

                share.popupShare();
                share.setContent(shareTitle, shareDesc, shareImgUrl, shareLink, callback);
            },

            /*删除帖子*/
            delFn: function($index) {
                if (app.myApp.ifLogin() == false) return; // 未登录跳转去登陆
                app.myApp.ajax({
                    url: '/community/cardDelete',
                    data: {
                        id: $scope.data.rows[$index].cardDetail._id
                    }
                }, function(res) {
                    if (!res.err) {
                        $scope.data.rows[$index].cardDetail.isDelete = true;
                        $scope.$digest();
                        $.toast('删除成功！');
                    } else $.toast(res.errMsg);
                });
            },

            /*头部分享*/
            headRightFn: function() {
                var shareTitle = "我通过任意门把美妆的时髦笔记分享给你",
                    shareDesc = $scope.topicDetail.name? $scope.topicDetail.name:"点击更多惊喜哦~",
                    shareImgUrl = "http://img.beautysite.cn" + $scope.topicDetail.image,
                    shareLink = location.href,
                    callback = {
                        success: function() {
                            $.toast("分享成功！");
                            $(".wxfx").remove();
                            app.myApp.recordShare($http, 0, 2);
                        }
                    };
                share.popupShare();
                share.setContent(shareTitle, shareDesc, shareImgUrl, shareLink, callback);
            },

            /*点赞动画*/
            initWow: function($index) {
                app.myApp.cnzz('wow');

                if (app.myApp.ifLogin() == false) return; // 未登录跳转去登陆
                var wowValue = $scope.data.rows[$index].cardDetail.wowValue || 0;

                if ($scope.data.rows[$index].cardDetail.hasWow) { // wow过了提示
                  $.toast("你已经WOW过了哦~");
                  return;
                }

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

                                var $headImg = $(".postList").eq($index).find(".flowers img").first();
                                $headImg.prop("src", $headImg.attr("lazySrc"));

                            } else $.toast(res.errMsg);
                        });
                    }
                });
            },

            /*点击头像跳转用户首页*/
            downHome : function(item) {
                location.href = '#/community/home/' + item.cardDetail.memberId;
            },

            /* 跳转去wow列表 */
            toWowList: function($index, $event) {
                $event.stopPropagation();
                location.hash = '#/community/wow/' + $scope.data.rows[$index].cardDetail._id;
            },

            /*发帖弹出下载页*/
            downloadModal : function() {
                $.modal({
                    text: '<img src="/static/img/community/modal-appDownload.png">',
                    extraClass: 'modal-appDownload',
                    buttons: [{
                        text: '<img src="/static/img/community/modal-appDownload-close.png">'
                    }, {
                        text: '<img src="/static/img/community/modal-appDownload-btn0.png">'
                    }, {
                        text: '<img src="/static/img/community/modal-appDownload-btn1.png">',
                        onClick: function() {
                            location.href = 'http://wechat.beautysite.cn/h5/download';
                        }
                    }]
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
                    $(document).on('open', '.actions-modal', function() {
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
            inputFooterStatus: function() {
                $scope.windowHeight = $(window).height();

                var focusInputInterval = setInterval(function() {
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
                var scrollDistence = $($event.target).offset().top - $(window).height() / 3;
                $('.content').scrollTop($('.content').scrollTop() + scrollDistence);
            },

            /* 帖子评论 */
            sentComment: function($index, $event) {
                $event.stopPropagation();

                if (app.myApp.ifLogin(location.hash, location.hash) == false) return;

                if (!$scope.data.rows[$index].addCommentText) {
                    $.toast('你还没有输入内容哦~');
                    return;
                }

                app.myApp.http($http, {
                    url: '/member/card/comment/save',
                    data: {
                        cardId: $scope.data.rows[$index].cardDetail._id, // 帖子id
                        type: $scope.data.rows[$index].commentType || 0, // 类型(1是回复,0是评论)
                        content: $scope.data.rows[$index].addCommentText, // 评论内容
                        sourceId: $scope.data.rows[$index].sourceId // 被回复人id
                    }
                }, function(res) {
                    if (res.data.missionTip) $.completeTaskModal(res.data.missionTip);
                    $scope.data.rows[$index].commentList.unshift(res.data);
                    $scope.data.rows[$index].cardDetail.commentNums++;
                    $scope.data.rows[$index].addCommentText = '';
                });
            }
        });

        $scope.init();
    }]);
});