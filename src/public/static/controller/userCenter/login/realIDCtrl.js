/**实名认证-美妆商城    					控制器 依赖JS CSS
 * @param   {string} 'app'                 	app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'moment'               moment.js
 * @param   {string} 'address'              address.js
 * @param   {string} 'fileUpload'           fileUpload.js
 */

define([
	'app',
	'angular',
	'moment',
	'address',
	'fileUpload',
	'cs!style',
	'cs!smCss',
	'smJs',
	'/common/directive/header/header.js',
	'cs!static/css/userCenter/login/realID'
], function(app, angular, moment) {

	/*定义 userCenter/login/realIDCtrl 控制器*/
	app.angular.controller('userCenter/login/realIDCtrl', [
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
				this.initUploadFile();
			},

			/* 初始化静态 $scope */
			staticScope: function() {
				app.myApp.settitle($rootScope, '实名认证-美妆商城'); // 设置 title
				app.myApp.viewport("device"); // 设置viewport
			},

			/* initAjax */
			initAjax: function(){
				app.myApp.ajax({	// 实名认证详情
	                url: '/account/verifyDetail'
	            }, function(res) {
	                if (!res.err) {
	                	if (!res.data) {	// 没有认证
	   						res.data = {};
	                	}
	                	res.data.schoolYear = moment(res.data.schoolYear).format('YYYY-MM-DD')
	                    $scope.data = res.data;
	                    $scope.$digest();

	                    if ([0, 1].indexOf($scope.data.status) == -1) {
	                    	$scope.initAddress();
	                    	$scope.initCalendar("schoolYear", $scope.data.schoolYear);
	                    }
	                } else $.toast(res.errMsg, 2000, 'toast-login-realID');
	            });
			},

			/* init calendar */
			initCalendar: function(id, yymmdd){
				$("#" + id).calendar({ // 生日
					value: [yymmdd || '1995-01-01']
				});
			},

			/* 选择地址 */
			initAddress: function(){
				$("#selectSchool").address({callback: function(self){
					$scope.data.school = $("#selectSchool").val();
					$scope.data.schoolId = $("#selectSchool").data("id");
				}});
			},

			/* jinit uploadFile */
			initUploadFile: function(){
				$(".uploadFile").fileUpload({
					remotePath: '/login',
					callback: $scope.fileuploadBack
				});
			},

			/* 上传图片回调 */
			fileuploadBack: function(res) {
				var img = app.myApp.iniValue.isWeiXin ? res.data : res.data.img;
				$scope.data.img = [img];
				$.toast("上传成功！", 2000, 'toast-login-realID');
				$scope.$digest();
			},

			/* 实名认证申请 */
			applyAuthentication: function(){
				if ($scope.send) return;
				$scope.send = true;

				app.myApp.ajax({	// 申请认证
	                url: '/account/verify',
	                data: $scope.data
	            }, function(res) {
	            	$scope.send  = false;
	                if (!res.err) {
	                    $.toast("申请成功！", 2000, 'toast-login-realID');
	                    $scope.data.status = 0;
	                    $scope.$digest();
	                } else $.toast(res.errMsg, 2000, 'toast-login-realID');
	            });
			},

			/* 提交 */
			headRightFn: function(){
				if ([0, 1].indexOf($scope.data.status) > -1) return;

				if (!$scope.data.name) {
					$.toast("请填写姓名！", 2000, 'toast-login-realID');
					return;
				}

				if ($scope.data.idCard.length != 18) {
					$.toast("请填写正确的身份证号！", 2000, 'toast-login-realID');
					return;
				}

				if (!$scope.data.school) {
					$.toast("请选择学校！", 2000, 'toast-login-realID');
					return;
				}

				if (!$scope.data.schoolYear) {
					$.toast("请选择入学年份！", 2000, 'toast-login-realID');
					return;
				}

				if (!$scope.data.img.length) {
					$.toast("请上传照片！", 2000, 'toast-login-realID');
					return;
				}

				$scope.applyAuthentication();
			}
		});

		$scope.init();
	}]);
});


// 上传图片
