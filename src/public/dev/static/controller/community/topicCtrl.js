/**话题-美妆商城                                      控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */

define(['app', 'angular', 'cs!style', 'cs!smCss', 'pager', 'lazyLoad', 'smJs', '/common/directive/header/header.js', 'cs!static/css/community/topic'], function(app, angular) {

    /*定义 topicCtrl 控制器*/
    app.angular.controller('community/topicCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {

        $.extend($scope, {
            init: function() {
                this.staticScope();
                this.paging();
            },

            /* 初始化静态 $scope */
            staticScope: function() {
                app.myApp.settitle($rootScope, '话题-美妆商城'); // 设置 title
                app.myApp.viewport("device"); // 设置viewport
                $scope.buttonText = "+订阅";
            },

            /*数据加载*/
            paging: function() {
                $.pager({
                    $scope: $scope,
                    lazyEle: '.lazy',
                    scrollEle: '.content',
                    url: '/community/TopicList',
                    callBack: function(res) {
                        if ($scope.data) $scope.data.rows = $scope.data.rows.concat(res.data.rows);
                        else $scope.data = res.data.rows;
                        $scope.defult = 'defult';
                        $scope.$digest();
                    },
                });
            },

            /*点击跳转到详情*/
            jump: function(item) {
                location.href = "#/community/topicDetail/" + item.name;;
            },

            /*话题订阅*/
            subscribe:function(item){   //hasSubscribe=true 已订阅 false 未订阅
                if(item.hasSubscribe){
                    app.myApp.ajax({    //取消订阅
                        url:'/community/unSubscribe',
                        data:{
                            tagName:item.name
                        }
                    },function(res){
                        if(!res.err){
                            item.hasSubscribe=false;
                            $scope.$digest()
                        }else $.toast(res.errMsg)
                    })
                }else{
                    app.myApp.ajax({    //订阅
                        url:'/community/subscribe',
                        data:{
                            tagName:item.name
                        }
                    },function(res){
                        if(!res.err){
                            item.hasSubscribe=true;
                            $scope.$digest()
                        }else $.toast(res.errMsg)
                    })
                }
            }
        });
        $scope.init();
    }]);
});