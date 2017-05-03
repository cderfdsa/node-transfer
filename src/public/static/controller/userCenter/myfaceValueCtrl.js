/**我的颜值-美妆商城                         控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 */

define([
    'app',
    'angular',
    'cs!smCss',
    'smJs',
    'pager',
    '/common/directive/header/header.js',
    'cs!static/css/userCenter/myfaceValue'
], function(app, angular) {

/*定义 userCenter/myfaceValueCtr 控制器*/
app.angular.controller('userCenter/myfaceValueCtrl', [
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

        /* initialize static $scope */
        staticScope: function() {
            app.myApp.settitle($rootScope, '我的颜值-美妆商城');    // set title
			app.myApp.viewport("device");   // set viewport
        },

		/* get initialize data */
        initAjax: function() {
            //用户信息
            app.myApp.ajax({
                url:'/account/userInfo'
            },function(res){
                if(!res.err){
                    $scope.face = res.data.user;
                    $scope.$digest();
                }else $.toast(res.errMsg)
            })
            /*分页数据*/
            $.pager({
                $scope: $scope,
                scrollEle: '.content',
                url: '/account/userFace',
                data:{
                    pageSize:20
                },
                callBack: function(res) {
                    $(res.data.rows).each(function(index, item) {
                        if(!item.remark){
                            if(item.type==1){
                                item.remark="签到"
                            }else if(item.type==2){
                                item.remark="分享商品 "
                            }else if(item.type==3){
                                item.remark="浏览商品"
                            }else if(item.type==4){
                                item.remark="邀请注册"
                            }else if(item.type==5){
                                item.remark="注册"
                            }else if(item.type==6){
                                item.remark="下载App"
                            }else if(item.type==7){
                                item.remark="完善信息"
                            }else if(item.type==8){
                                item.remark="每日下单任务"
                            }else if(item.type==9){
                                item.remark="每日完成5种任务"
                            }else if(item.type==10){
                                item.remark="消费"
                            }else{
                                item.remark="其他"
                            }
                        }
                    });
                    if ($scope.data) $scope.data.rows =$scope.data.rows.concat(res.data.rows);
                    else $scope.data = res.data;
                    $scope.$digest();
                }
            });

            // 兑吧首页链接
            app.myApp.http($http, {
                url: '/member/duiba/url',
                method: 'GET',
                loading: false
            }, function(res){
                $scope.duibaUri = res.data;
            });
        },

        headRightFn: function(){
            location.href = $scope.duibaUri;
        }
    });

    $scope.init();



    }]);
});
