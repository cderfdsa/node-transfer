/**绑定手机号码-美妆商城    					控制器 依赖JS CSS
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
	'/common/directive/formtemplate/formtemplate.js',
	'cs!static/css/userCenter/login/bindPhone'],
	function(app, angular) {
	/*定义 userInfoCtrl 控制器*/
	app.angular.controller('userCenter/login/bindPhoneCtrl', [
		'$rootScope',
		'$scope',
		'$state',
		'$stateParams',
		'$http',
		function($rootScope, $scope, $state, $stateParams, $http) {

		$.extend($scope, {
			init: function() {
				this.staticScope();
				// this.initAjax();
				this.analyseType();
			},

			/* 初始化静态 $scope */
			staticScope: function() {
				app.myApp.settitle($rootScope, '绑定手机号码-美妆商城'); // 设置 title
				app.myApp.viewport("device"); // 设置viewport
				$scope.mobiles = $rootScope.mobile || '';
				$rootScope.mobile = null;
				 $scope.mobileView =$scope.mobiles.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
			},

			analyseType: function(){
				$scope.type = location.search.replace(/.*type\=(\d)\&*.*/g, '$1');
				$scope.staticData = [
					{
						icon:'/static/img/userCenter/icon_phone.png',
						icon_close: '/static/img/userCenter/icon_input_close.png',
						placeholder: '请输入原手机号码',
						type: 'old_mobile',
						data:'old_mobile'
					},
					{
						icon:'/static/img/userCenter/icon_phone.png',
						icon_close: '/static/img/userCenter/icon_input_close.png',
						placeholder: '请输入手机号',
						type: 'mobile'
					},
					 {
						type: 'smsCaptcha',
						icon:'/static/img/userCenter/icon_number.png',
						icon_close: '/static/img/userCenter/icon_input_close.png',
						valid: '/.{2,10}/g',
						data:'authcode'
					},
					{
						type: 'voice'
					},
					{
						text: '确定',
						type: 'submit'
					}];
				 if(!$scope.mobiles){
				 	$scope.staticData.shift();
				 }
			},
			sucback:function(){
				location.href= '#/userCenter/login/bindAccount';
			}
		});

		$scope.init();
	}]);
});