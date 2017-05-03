/**设置/修改密码-美妆商城    					控制器 依赖JS CSS
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
	'cs!static/css/userCenter/login/password'],
	function(app, angular) {

	/*定义 userInfoCtrl 控制器*/
	app.angular.controller('userCenter/login/passwordCtrl', [
		'$rootScope',
		'$scope',
		'$state',
		'$stateParams',
		'$http',
		function($rootScope, $scope, $state, $stateParams, $http) {

		$.extend($scope, {
			init: function() {
				this.staticScope();
				this.analyseType();
			},

			/* 初始化静态 $scope */
			staticScope: function() {
				app.myApp.settitle($rootScope, '设置/修改密码-美妆商城'); // 设置 title
				app.myApp.viewport("device"); // 设置viewport
				var url = location.hash.split("/");
				$scope.type = + url[url.length - 1];
				$scope.mobiles = $rootScope.mobile || '';
				$rootScope.mobile = null;
				$scope.mobileView =$scope.mobiles.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
			},

			analyseType: function(){		//type=1 重置密码要输手机号
				if($scope.type == 1){
					$scope.mobiles='';
					var interval = setInterval(function(){
						if ($(".formLine.mobile")[0]) {
							$(".formLine.mobile").show();
							clearInterval(interval);
						}
					}, 50);
				};
				$scope.staticData = [
					{
						icon:'/static/img/userCenter/icon_phone.png',
						icon_close: '/static/img/userCenter/icon_input_close.png',
						placeholder: '请输入手机号',
						type: 'mobile',
						value:$scope.mobiles
					},{
						type: 'smsCaptcha',
						icon:'/static/img/userCenter/icon_number.png',
						icon_close: '/static/img/userCenter/icon_input_close.png',
						valid: '/.{2,10}/g',
						data: 'code'
					},{
						type: 'voice'
					},{
						type: 'password',
						icon: '/static/img/userCenter/icon_lock.png',
						iconRight: '/static/img/userCenter/icon_nosee.png',
						iconRightSee: '/static/img/userCenter/icon_see.png',
						valid: '/.{2,20}/g',
						data: 'passwd'
					},{
						text: '确定',
						type: 'submit'
					}];

			},
			/*回调地址*/
			sucback:function(){
				location.href= '#/userCenter/login/bindAccount';
			}
		});

		$scope.init();
	}]);
});