/**设置-美妆商城    					控制器 依赖JS CSS
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
	'cs!static/css/userCenter/login/setting'],
	function(app, angular) {
	/*定义 userInfoCtrl 控制器*/
	app.angular.controller('userCenter/login/settingCtrl', [
		'$rootScope',
		'$scope',
		'$state',
		'$stateParams',
		'$http',
		function($rootScope, $scope, $state, $stateParams, $http) {

		$.extend($scope, {
			init: function() {
				this.staticScope();
			},

			/* 初始化静态 $scope */
			staticScope: function() {
				app.myApp.settitle($rootScope, '设置-美妆商城'); // 设置 title
				app.myApp.viewport("device"); // 设置viewport
				$scope.isLogin = app.myApp.iniValue.isLogin();
				$scope.isWeiXin = app.myApp.iniValue.isWeiXin;
			},

			/* 退出登录状态 */
			loginout: function(){
				app.myApp.loginOut();
			}
		});

		$scope.init();
	}]);
});