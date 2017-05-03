/**合作平台搜索-美妆商城    				控制器 依赖JS CSS
 * @param   {string} 'app'                 	app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 */

define([
	'app',
	'angular',
	'cs!style',
	'cs!smCss',
	'smJs',
	'pager',
	'cs!static/css/platform/search'
], function(app, angular) {

	/* define platform/searchCtrl controller */
	app.angular.controller('platform/searchCtrl', [
		'$rootScope',
		'$scope',
		'$state',
		'$stateParams',
		'$http',
		function($rootScope, $scope, $state, $stateParams, $http) {

		$.extend($scope, {
			init: function() {
				this.staticScope();
				this.datetimePicker();
			},

			/* initialize static $scope */
			staticScope: function() {
				app.myApp.settitle($rootScope, '合作平台-美妆商城'); // set title
				app.myApp.viewport("device"); // set viewport
				$scope.origin = location.origin;	// set origin

				$scope.type = $stateParams.type;	// login type

				$scope.loginData = JSON.parse(decodeURIComponent($.getCookie("platformLoginData")));	// 用户登录信息
				if (!$scope.loginData) location.href = '#/platform/signIn';
			},

			downLoad: function(sex){
				$.showPreloader('下载中...');
				location.href = $scope.origin + '/distributor/downloadPic?sex=' + sex + '&inviteCode=' + $scope.loginData;
			},

			/* initialize dateTimePicker */
			datetimePicker: function(){
				var date = new Date(),
					yyyy = date.getFullYear(),
					MM = date.getMonth() + 1,
					dd = date.getDate();

				$("#startDate, #endDate").calendar({
					maxDate: yyyy + '-' + MM + '-' + dd
				});
			},

			onlyEndDate: function(){
				if (!$scope.startDate) {
					$.toast("请先选择开始日期！");
					return;
				}
			},

			search: function(){
				$(".loadAll, .swipLoad").remove();

				$.pager({
                	$scope: $scope,
                	scrollEle: '.content',
                	repeatEle: 'tbody tr',
                	url: ['/distributor/code/list', '/inviteCode/scan/stat'][$scope.type],
                	http: $http,
                	method: 'GET',
                	data: $.extend([{
                    		id: $scope.loginData.id			// 合作商Id(必填)
                    	}, {}][$scope.type], {
							code: [$scope.code, $scope.loginData][$scope.type],				// 邀请码
							startDate: $scope.startDate,	// 开始日期
							endDate: $scope.endDate			// 结束日期
                    	})
              	});
			},

			/* quit login */
			quit: function(){
            	$.setCookie("platformLoginData", '', -1);
            	location.href = '#/platform/signIn';
			}

		});

		$scope.init();
	}]);
});
