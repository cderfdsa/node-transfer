/**新版上线-美妆商城    					控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'share'                share.js
 */

define([
	'app',
	'angular',
	'share',
	'cs!style',
	'cs!smCss',
	'smJs',
	'/common/directive/header/header.js',
	'cs!static/css/activity/newVersion'
	], function(app, angular, share) {

	/*定义 newVersionCtrl 控制器*/
	app.angular.controller('activity/newVersionCtrl', [
		'$rootScope',
		'$scope',
		'$state',
		'$stateParams',
		'$http',
		function($rootScope, $scope, $state, $stateParams, $http) {
			app.myApp.settitle($rootScope, '新版上线-美妆商城');
			app.myApp.viewport("device");

			/* 左返回 */
			$scope.headLeftFn = function(){
				if (history.length <= 1)
                    location.hash = '#/home';
                else history.back();
			}

			/* 分享 */
			var shareTitle = "美妆商城2.0版上线啦",
          	shareDesc = "亲爱的闺蜜们，让你们久等了！这里是美女大学生的聚集地，来这里，我们一起变美~",
          	shareImgUrl = location.origin + "/static/img/activity/share_newVersion.png",
          	shareLink = location.href,
          	callback = {
	            success: function() {
	              $.toast("分享成功！");
	              $(".wxfx").remove();
	              app.myApp.recordShare($http, 0, -1);
	            }
          	};
        	share.setContent(shareTitle, shareDesc, shareImgUrl, shareLink, callback);

			$scope.shareFn = function(){
	        	share.popupShare();
			}

		}
	]);
});
