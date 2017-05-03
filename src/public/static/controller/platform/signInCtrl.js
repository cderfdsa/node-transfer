/**合作平台登录-美妆商城    					控制器 依赖JS CSS
 * @param   {string} 'app'                 	app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */

define([
	'app',
	'angular',
	'md5',
	'cs!style',
	'cs!smCss',
	'smJs',
	'cs!static/css/platform/signIn'
], function(app, angular, md5) {

	/* define platform/signInCtrl controller */
	app.angular.controller('platform/signInCtrl', [
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

			/* initialize static $scope */
			staticScope: function() {
				app.myApp.settitle($rootScope, '合作平台登录-美妆商城'); // set title
				app.myApp.viewport("device"); // set viewport
			},

			focus: function($event){
				$event.target.style.borderColor = '#ff577f';
			},

			blur: function($event){
				$event.target.style.borderColor = '#ccc';
			},

			change: function(i){
				var index = Number(i == 0 ? (!!$scope.account && !!$scope.password) : !!$scope.inviteCode)
				$("[type='submit']").eq(i).css("background", ['#ccc',"#ff577f"][index]);
				$scope.validateStatus = index;
			},

			submit: function(i){
				if (i == 0 && !$scope.account) {
					$.toast("请输入登录账号哦~");
					return;
				}

				if (i == 0 && $scope.account && !$scope.password) {
					$.toast("请输入密码哦~");
					return;
				}

				if (i == 1 && !$scope.inviteCode) {
					$.toast("请输入登录邀请码哦~");
					return;
				}

				if (send) return;
				var send = true;

				app.myApp.http($http, {
                    url: ['/distributor/login', '/distributor/code/login'][i],
                    method: 'POST',
                    data: [{
                    	username: $scope.account,
                    	passwd: md5.hex_md5($scope.password || '')
                    }, {
                    	code: $scope.inviteCode
                    }][i]
                }, function(res){
                	$.setCookie("platformLoginData", encodeURIComponent(JSON.stringify(res.data)), 10);
                    send = false;
                    $.toast("登录成功！");
                    setTimeout(function(){
						location.hash = "#/platform/search/" + i;
					}, 2000);
                });
			}

		});

		$scope.init();
	}]);
});
