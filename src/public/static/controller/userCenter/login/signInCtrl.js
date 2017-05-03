/**注册-美妆商城    						控制器 依赖JS CSS
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
	'cs!static/css/userCenter/login/signIn'
], function(app, angular) {

	/*定义 userCenter/login/signInCtrl 控制器*/
	app.angular.controller('userCenter/login/signInCtrl', [
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
				// 将返回的 hash 转移到 scope
				$scope.loginBackHash = localStorage.loginBackHash || '#/home';
				$scope.signInBackHash = localStorage.signInBackHash;

				if (app.myApp.iniValue.isLogin())	// 已登录跳转回原页面
					location.hash = $scope.loginBackHash;

				app.myApp.settitle($rootScope, '注册-美妆商城'); // 设置 title
				app.myApp.viewport("device"); // 设置viewport

				$scope.isWeixin = app.myApp.iniValue.isWeiXin;
			},

			/* 登陆成功后跳转 */
			successBack: function(res){
				$.setCookie("user_login_token", res.data.token);
				$.setCookie("user_login_token_expire", res.data.expire);

				localStorage.removeItem('signInBackHash');
				if (res.data.isNew) {	// 新用户
					app.myApp.cnzz('register');
					location.hash = '#/userCenter/login/perfectInfo';
					return;
				} else {
					localStorage.removeItem('loginBackHash');
				}
				app.myApp.cnzz('login');
				// 诸葛io(识别用户)
				// app.myApp.http($http, {
    //                 url: '/member/detail',
    //                 data: {
    //                     v: 1.0
    //                 },
    //                 method: 'GET',
    //                 defaultResErr: false,
    //                 loading: false
    //             }, function(res){
    //                 if (!res.err) {
    //                     var birthday = new Date(res.data.birthday);
    //                     zhuge.identify(res.data.id, {
    //                         avatar: res.data.headImg,    // 用户分析界面的头像
    //                         name: res.data.nickName,     // 用户名
    //                         gender: ['女', '男', '女'][res.data.sex],  // 用户性别（男，女）
    //                         birthday: birthday.getFullYear() + '/'
    //                             + ((birthday.getMonth()+1).toString().length < 2 ? '0' : '') + (birthday.getMonth()+1) + '/'
    //                             + (birthday.getDate().toString().length < 2 ? '0' : '') + birthday.getDate(), // 生日（yyyy/MM/dd）
    //                         location: res.data.city      // 地域（如：北京）
    //                     });
    //                 }
    //             });

				location.hash = $scope.loginBackHash + (/\?/g.test($scope.loginBackHash) ? '&' : '?') + 'fromSignIn=true';
			},

			/* 不登录返回 */
			headLeftfn: function(){
				localStorage.removeItem('loginBackHash');
				localStorage.removeItem('signInBackHash');

				if ($scope.signInBackHash && location.hash.indexOf('#/userCenter/login/signIn/1') > -1)
					location.hash = $scope.signInBackHash;
				else history.back();
			},

			/* $stateParams.type：register(0) quick login(1) passwordLogin(2)  */
			analyseType: function(){
				$scope.type = $stateParams.type;
				$scope.suctip = !$scope.type ? "注册成功！" : "登录成功";
				$scope.staticData = [{
					type: 'voice'
				}, {
					type: 'mobile'
				}, {
					text: '登录',
					type: 'submit'
				}];

				if ($scope.type < 2)
					$scope.staticData = [{
						type: 'voice'
					}, {
						type: 'mobile'
					}, {
						type: 'smsCaptcha'
					}, {
						text: '登录',
						type: 'submit'
					}];
				else
					$scope.staticData = [{
						type: 'mobile'
					}, {
						type: 'password'
					}, {
						text: '登录',
						type: 'submit'
					}];
			},

			/* 第三方登录 weibo weixin qq */
			thirdLogin: function(type) {
				app.myApp.cnzz('thirdLogin');
				app.myApp.thirdLogin(type, $scope.loginBackHash + '&fromSignIn=true');
			}
		});

		$scope.init();
	}]);
});
