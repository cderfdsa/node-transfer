/**大使分销——我的用户 -美妆商城             控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
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
    'cs!static/css/userCenter/ambCenter/bestieUser'
], function(app, angular, moment) {

    /*定义 incomeDetailCtrl 控制器*/
    app.angular.controller('userCenter/ambCenter/bestieUserCtrl', [
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

                staticScope: function() {
                    /*设置标题*/
                    app.myApp.settitle($rootScope, '我的用户-美妆商城');
                    app.myApp.viewport("device");
                },

                initAjax: function() {
                    $.pager({
                        $scope: $scope,
                        scrollEle: '.content',
                        url: '/member/my/members',
                        data: {
                            type: 0
                        },
                        http: $http,
                        method: 'GET',
                        callBack: function(res) {
                            if (res.data.left < 0) res.data.left = 0;

                            $(res.data.rows).each(function($index, item) {
                                item.lastLogin = moment(item.lastLogin).format('YYYY-MM-DD HH:mm:ss')
                            })
                            if ($scope.data) $scope.data.rows = $scope.data.rows.concat(res.data.rows);
                            else $scope.data = res.data;
                        }
                    });
                },
                /*解绑*/
                unbind: function(item) {
                    $.modal({
                        title: '您确定要解绑？',
                        extraClass: 'bestieUserModal',
                        buttons: [{
                            text: '不解绑了',
                            close: true,
                            onClick: function() {
                                $.closeModal()
                            }
                        }, {
                            text: '确认解绑',
                            onClick: function() {
                                app.myApp.http($http, {
                                    url: '/member/mymember/unbind',
                                    method: 'POST',
                                    data: {
                                        memberId: item.id
                                    }
                                }, function(res) {
                                    $.toast("解绑成功！")
                                    $scope.data.rows.shift();
                                }, function(res) {
                                    $.toast(res.errMsg)
                                })
                            }
                        }]
                    });
                },

                /*点击头像去用户中心*/
                toHome: function(item) {
                    location.href = '#/community/home/' + item.member.id;
                },

                /*点击去规则说明*/
                toExplain: function() {
                    location.href = '#/userCenter/ambCenter/explain'
                }
            });
            $scope.init();
        }
    ]);
});