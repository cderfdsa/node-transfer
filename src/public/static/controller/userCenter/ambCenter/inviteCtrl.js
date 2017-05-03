/**邀请大使/闺蜜好友-美妆商城    			控制器 依赖JS CSS
 * @param   {string} 'app'                 	app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
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
	'cs!static/css/userCenter/ambCenter/invite'
], function(app, angular, share) {

	/* define userCenter/ambCenter/inviteCtrl controller */
	app.angular.controller('userCenter/ambCenter/inviteCtrl', [
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
			},

			/* initialize static $scope */
			staticScope: function() {
                $scope.type = $stateParams.type;	// 0邀请大使 1邀请闺蜜好友
				app.myApp.settitle(  // set title
                    $rootScope,
                    '邀请' + ['大使', '闺蜜好友'][$scope.type]+ '-美妆商城'
                );
				app.myApp.viewport("device");   // set viewport
			},

			/* get initialize data */
			initAjax: function() {
				app.myApp.http($http, { // 获取用户信息
					url: '/member/detail',
					method: 'GET',
					data:{
						v:1.0
					}
				}, function(res){
					$scope.user = res.data;
				})

				app.myApp.http($http, { // 获取系统配置
					url: '/system/config',
					method: 'GET'
				}, function(res){
					$scope.config = res;
				})

				if ($scope.type == 0) {
					app.myApp.http($http, { // 获得大使邀请码
						url: '/member/inviteCode/detail',
						method: 'GET'
					}, function(res){
						$scope.inviteCode = res.data;
					})
				} else {
					app.myApp.http($http, { // 获取邀请闺蜜分享code
						url: '/member/code',
						method: 'GET'
					}, function(res){
						$scope.inviteCode = res.data;
					})
				}

			},

            /* invite records link */
            inviteRecordLink: function(){
                location.href = '#/userCenter/inviteRecord';
            },

            /* invite share*/
            share: function(){
                var shareTitle = $scope.config[['inviteSenior', 'invite'][$scope.type]].title,
                    shareDesc = $scope.config[['inviteSenior', 'invite'][$scope.type]].text,
                    shareImgUrl = location.origin + [
						'/static/img/userCenter/ambCenter/icon_share.png',
						'/static/img/userCenter/icon_shareBonus.jpg'
					][$scope.type],
                    shareLink = $scope.config[['inviteSenior', 'invite'][$scope.type]].qrcode + $scope.inviteCode,
                    callback = {
                        success: function() {
                            $.toast("分享成功！");
                            $(".wxfx").remove();
                            app.myApp.recordShare($http, 0, -1);
                        }
                    };

                share.setContent(shareTitle, shareDesc, shareImgUrl, shareLink, callback);
                share.popupShare();

                $("body").delegate(".modal-overlay", "click", function() { // close tip modal
                    $.closeModal();
                });
            }
		});

		$scope.init();
	}]);

});
