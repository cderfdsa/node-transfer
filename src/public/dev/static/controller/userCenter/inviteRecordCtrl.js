/**邀请记录-美妆商城    					控制器 依赖JS CSS
 * @param   {string} 'app'                 	app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */

define([
	'app',
	'angular',
	'cs!style',
	'cs!smCss',
	'smJs',
	'/common/directive/header/header.js',
	'cs!static/css/userCenter/inviteRecord'
], function(app, angular) {

	/* define userCenter/inviteRecordCtrl controller */
    app.angular.controller('userCenter/inviteRecordCtrl', [
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
                app.myApp.settitle($rootScope, '邀请记录-美妆商城'); // set title
                app.myApp.viewport("device"); // set viewport
            },

            /* get initialize data */
            initAjax: function() {
                app.myApp.http($http, {	// 邀请用户列表
                    url: '/member/invite/totalCount',
                    method: 'GET'
                }, function(res){
                    $scope.totalCount = res.data;
                });

                app.myApp.http($http, {	// 累计邀请金额
                    url: '/member/invite/list',
                    method: 'GET'
                }, function(res){
                    $scope.lists = res.data;
                });

            }

		})
		$scope.init();
	}]);
});
