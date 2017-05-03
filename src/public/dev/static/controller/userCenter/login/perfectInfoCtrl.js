/**完善信息-美妆商城    					控制器 依赖JS CSS
 * @param   {string} 'app'                 	app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'fileUpload'           fileUpload.js
 */

define([
	'app',
	'angular',
	'cs!style',
	'cs!smCss',
	'smJs',
	'fileUpload',
	'/common/directive/header/header.js',
	'cs!static/css/userCenter/login/perfectInfo'
], function(app, angular) {

	/*定义 perfectInfoCtrl 控制器*/
	app.angular.controller('userCenter/login/perfectInfoCtrl', [
		'$rootScope',
		'$scope',
		'$state',
		'$stateParams',
		'$http',
		function($rootScope, $scope, $state, $stateParams, $http) {

		$.extend($scope, {
			init: function() {
				this.staticScope();
				this.initUploadFile();
			},

			/* 初始化静态 $scope */
			staticScope: function() {
				app.myApp.settitle($rootScope, '完善信息-美妆商城'); // 设置 title
				app.myApp.viewport("device"); // 设置viewport

				$scope.nickName = 'meiwan' + parseInt(Math.random()*1e6);
				$scope.sex = '2';
				$scope.loginBackHash = localStorage.loginBackHash || "#/home";
	console.log($scope.loginBackHash)
				localStorage.removeItem('loginBackHash');
			},

			/* jinit uploadFile */
			initUploadFile: function(){
				$(".uploadFile").fileUpload({
					text: '设置头像',
					remotePath: '/login',
					callback: $scope.saveUserHeadImg
				});
			},

			/* jump  */
			headRightFn: function(){
				location.hash = $scope.loginBackHash;
			},

			saveUserHeadImg: function(res){	// 上传头像
				$scope.viewImgUrl = app.myApp.iniValue.isWeiXin ? res.data : res.data.img;
				$scope.$digest();

				app.myApp.ajax({
					url: '/account/saveUserHeadimg',
					data: {
						headImg: $scope.viewImgUrl
					}
				}, function(res) {
					if (!res.err) {
						$.toast("上传成功~");
					} else $.toast(res.errMsg);
				});
			},

			/* 初始化动态数据 */
			submit: function() {
				if (!$scope.nickName) {
					$.toast('请输入昵称~');
					return;
				}

				if (!$scope.sex) {
					$.toast('请选择性别~');
					return;
				}

				if (!$scope.viewImgUrl) {
					$.modal({
						text: "不设头像会被淹没在茫茫人海中的，呜呜…",
						buttons: [{
				          text: '回头再说',
				          onClick: function() {
				          	$scope.submitAjax();
				          }
				        }, {
				          text: '设头像'
				        }]
					});
					return;
				}

				$scope.submitAjax();

			},

			submitAjax: function(){
				if ($scope.send) return;
				$scope.send = true;

				app.myApp.ajax({		// 保存用户信息
					url: '/account/saveUserInfo',
					data: {
						nickname: $scope.nickName,
						sex: $scope.sex
					}
				}, function(res) {
					$scope.send = false;

					if (!res.err) {
						$.toast('信息保存成功！');
						setTimeout(function(){
							location.hash = $scope.loginBackHash;
						}, 2000);
						$scope.$digest();
					} else $.toast(res.errMsg);
				});
			}
		});

		$scope.init();
	}]);
});