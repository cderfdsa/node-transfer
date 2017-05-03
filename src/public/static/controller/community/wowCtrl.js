/**wow列表-美妆商城                                     控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 * @param   {string} 'moment'               moment.js
 */

define(['app', 'angular', 'moment', 'cs!style', 'cs!smCss', 'smJs', 'pager', 'lazyLoad', '/common/directive/header/header.js','/common/directive/wow/wow.js','cs!static/css/community/wow'], function(app, angular, moment) {

    /*定义 wowCtrl 控制器*/
    app.angular.controller('community/wowCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {

        $.extend($scope, {
            init: function() {
                this.staticScope();
                this.initAjax();
                this.swipeUp();
                this.swipeDown();
            },

            /* 初始化静态 $scope */
            staticScope: function() {
                app.myApp.settitle($rootScope, 'WOW-美妆商城'); // 设置 title
                app.myApp.viewport("device"); // 设置viewport
                $scope.haswow = location.hash.replace(/.*hasWow\=([A-z]*).*/g,'$1');
                $scope.hideNav = true;
            },

            /* 初始化动态数据 */
            initAjax: function() {
                app.myApp.ajax({
                        url: '/account/userInfo',
                    }, function(res) {
                        if (!res.err) {
                            $scope.userInfo = res.data;
                            $scope.$digest();
                        } else $.toast(res.errMsg)
                    }),
                $.pager({ // 获取话题列表
                    $scope: $scope,
                    lazyEle: '.lazy',
                    scrollEle: '.content',
                    data: {
                        cardId: $stateParams.id
                    }, // 帖子ID
                    url: '/community/cardWowList',
                    callBack: function(res) {
                        /* 转时间显示规则 */
                        var now = new Date().getTime();
                        var contents = ['好像还过得去耶~', '哎哟，不错哦~', '超赞！', '惊艳到了！', '完美！'];

                        $(res.data.rows).each(function(index, item) {
                            var date = new Date(item.createdAt).getTime(),
                                dvalDate = (now - date) / (60 * 60 * 1000);
                            if (dvalDate < 1) item.createdAt = '刚刚';
                            else if (1 <= dvalDate && dvalDate < 24) item.createdAt = Math.floor(dvalDate) + '小时前';
                            else item.createdAt = moment(item.createdAt).format('YYYY-MM-DD');

                            item.content = contents[item.wow - 1];
                        });

                        /* pager 回调 数据组装 */
                        if ($scope.data) $scope.data.rows = $scope.data.rows.concat(res.data.rows);
                        else $scope.data = res.data;
                        $scope.$digest();
                    }
                });
            },

            /* 初始化wow */
            initWow: function() {
                app.myApp.cnzz('wow');

                if (app.myApp.ifLogin() == false) return; // 未登录跳转去登陆
                if ($scope.haswow=="true") { // wow过了提示
                        $.toast("你已经WOW过了哦~");
                        return;
                    }else{
                        $.wow({
                            success: function(index) {
                                app.myApp.ajax({ // WOW
                                    url: '/community/cardWow',
                                    data: {
                                        wow: index, // wow值
                                        cardId: $stateParams.id // 帖子ID
                                    }
                                }, function(res) {
                                    if (!res.err) {
                                        var time = moment().diff(moment(res.data.createdAt), "hours", true);
                                        var contents = ['好像还过得去耶~', '哎哟，不错哦~', '超赞！', '惊艳到了！', '完美！'];
                                        if (time <= 1) {
                                            res.data.createdAt = "刚刚";
                                        } else if (time > 1 && time <= 24) {
                                            res.data.createdAt = parseInt(time) + "小时前";
                                        } else if (time > 24) {
                                            res.data.createdAt = moment(res.data.createdAt).format("YYYY-MM-DD");
                                        }
                                        $scope.wowdata =res.data;
                                        $scope.wowdata.memberInfo={
                                            headImg:$scope.userInfo.user.headImg,
                                            nickName:$scope.userInfo.user.nickName,
                                            type:$scope.userInfo.user.adminLevel?$scope.userInfo.user.adminLevel:$scope.userInfo.type,
                                            level:$scope.userInfo.user.level,
                                        }

                                        if (res.data.missionTip) $.completeTaskModal(res.data.missionTip);
                                        else $.toast("送wow成功~");
                                        $scope.wowdata.content=contents[$scope.wowdata.wow -1]
                                        $scope.data.rows.unshift($scope.wowdata);
                                        $scope.$digest();
                                    } else $.toast(res.errMsg);
                                });
                            }
                        });
                    }
            },

            /*上滑*/
            swipeUp: function() {
                $(".content").swipeUp(function() {
                    $scope.hideNav = true;
                    $scope.$digest();
                })
            },
            // 下滑
            swipeDown: function() {
                $(".content").swipeDown(function() {
                    $scope.hideNav = false;
                    $scope.$digest();
                })
            },
        });

        $scope.init();

    }]);
});