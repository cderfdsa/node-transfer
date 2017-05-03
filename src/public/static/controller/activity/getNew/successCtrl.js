/**拉新活动-领取成功   						控制器 依赖JS CSS
 * @param   {string} 'app'                 	app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'share'                sharejs
 */

define([
	'app',
	'angular',
	'share',
	'cs!style',
	'cs!smCss',
	'smJs',
	'cs!static/css/activity/getNew/success'
], function(app, angular, share) {

	/*define activity/getNew/successCtrl controller*/
	app.angular.controller('activity/getNew/successCtrl', [
		'$rootScope',
		'$scope',
		'$state',
		'$stateParams',
		'$http',
		function($rootScope, $scope, $state, $stateParams, $http) {

			$.extend($scope, {
				init: function() {
					this.staticScope();
					this.wxShare();
				},

				/* initialize static $scope */
				staticScope: function() {
					app.myApp.settitle($rootScope, '美妆笑医生-看病赢大礼');	// set title
					app.myApp.viewport("device");	// set viewport
				},

				/*微信分享*/
				wxShare: function() {
					var shareTitle = "美妆笑医室，专业拯救不开心",
						shareDesc = "据说99%的大学生都有”病“，不信来测~还有精美化妆品拿哦~",
						shareImgUrl = location.origin + '/static/img/userCenter/ambCenter/icon_share.png',
						shareLink = location.origin + '/auth/weixin/?backUrl=/activity/getNew',
						callback = {
							success: function() {
								$.toast("分享成功！");
				                app.myApp.recordShare($http, 0, -1);
							}
						};

					share.setContent(shareTitle, shareDesc, shareImgUrl, shareLink, callback);
				}
			});

			$scope.init();
		}
	]);
});
