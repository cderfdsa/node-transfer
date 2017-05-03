/**账号绑定-美妆商城    					控制器 依赖JS CSS
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
	'cs!static/css/userCenter/login/bindAccount'],
	function(app, angular) {

	/*定义 userInfoCtrl 控制器*/
	app.angular.controller('userCenter/login/bindAccountCtrl', [
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
				this.showBindErr();
				this.thirdBindList();
			},

			/* 初始化静态 $scope */
			staticScope: function() {
				app.myApp.settitle($rootScope, '账号绑定-美妆商城'); // 设置 title
				app.myApp.viewport("device"); // 设置viewport
				$scope.isWeixin = app.myApp.iniValue.isWeiXin;
			},

			/* 初始化动态数据 */
			initAjax: function() {
				var self = this;
				app.myApp.ajax({
					url:'/account/userInfo'
				},function(res){
					if(!res.err){
						$scope.userInfo = res.data;
						console.log($scope.userInfo.user.mobile)
						$scope.$digest();
					}else $.toast(res.errMsg)
				})
			},

			showBindErr: function(){
				var err = location.hash.replace(/.*err\=(\d)\&.*/g,'$1');
				if (err == 1) {
				 	var errMsg = decodeURIComponent(location.hash.replace(/.*errMsg\=(.*)\&*/g,'$1'))
				 	$.toast(errMsg);
				}
			},

			/*更换绑定*/
			replace:function(){
				$rootScope.mobile = $scope.userInfo.user.mobile;
				location.href='#/userCenter/login/bindPhone';
			},

			/* 第三方登录 weibo qq */
			thirdLogin: function(type, source) {
				if(!source){
					localStorage.loginBackHash = location.hash;
			 		app.myApp.thirdBind(type);	//绑定
				} else {
					app.myApp.ajax({		//解绑
						url:'/account/thirUnBind',
						data:{
							source: ['weixin', 'weibo', 'qq'].indexOf(type)
						}
					},function(res){
						if(!res.err){
							$.toast("解绑成功!")
						}else $.toast(res.errMsg)
					})
				}
			},

			/*第三方绑定列表*/
			thirdBindList:function(type){
				app.myApp.ajax({
					url:'/account/thirdBindList',
				},function(res){
					if(!res.err){
						var data = [];
						$(res.data).each(function(index,item){
							data.push(item.source);
						});
						$scope.thirdBindList = data;
						$scope.$digest();
					}else $.toast(res.errMsg)
				})
			},

			// 设置密码跳转
			toPassword:function(){
				if(!$scope.userInfo.user.mobile){
					location.href='#/userCenter/login/bindPhone';
				}else{
					$rootScope.mobile = $scope.userInfo.user.mobile;
					location.href='#/userCenter/login/password/0'
				}
			}

		});
		$scope.init();
	}]);
});