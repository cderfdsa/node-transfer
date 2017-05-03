/**赚代言费-美妆商城    					控制器 依赖JS CSS
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
	'cs!static/css/activity/represent'
	], function(app, angular, share) {

	/*定义 representCtrl 控制器*/
	app.angular.controller('activity/representCtrl', [
		'$rootScope',
		'$scope',
		'$state',
		'$stateParams',
		'$http',
		function($rootScope, $scope, $state, $stateParams, $http) {
			app.myApp.settitle($rootScope, '赚代言费-美妆商城');
			app.myApp.viewport("device");

			/* 左返回 */
			$scope.headLeftFn = function(){
				if (history.length <= 1)
                    location.hash = '#/home';
                else history.back();
			}

			/* 分享 */
			var shareTitle = "大使们来赚代言费啦",
          	shareDesc = "亲爱的大使们，期待已久的没万邦来啦，在寝室躺着就能赚钱这种好事，别说帮助没有告诉你们啊~",
          	shareImgUrl = location.origin + "/static/img/activity/share_represent.png",
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
