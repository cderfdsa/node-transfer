/**购买成功-美妆商城    			         控制器 依赖JS CSS
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
	'cs!static/css/userCenter/ambCenter/buySuccess'
], function(app, angular, share) {

	/* define userCenter/ambCenter/buySuccessCtrl controller */
	app.angular.controller('userCenter/ambCenter/buySuccessCtrl', [
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
                $scope.type = $stateParams.type;	// 购买成功
				app.myApp.settitle($rootScope, '购买成功-美妆商城');  // set title
				app.myApp.viewport("device");   // set viewport

                $scope.domain = $domain;    // set domain
				$scope.orderId = $rootScope.specialBuy_orderId;	// order id
				$scope.mobile = $rootScope.ambSpecial_mobile;	//mobile

				// $rootScope.ambSpecial_mobile = $rootScope.specialBuy_orderId = null;
			},

			/* get initialize data */
			initAjax: function() {
				app.myApp.http($http, { // 获取系统配置
					url: '/system/config',
					method: 'GET'
				}, function(res){
					$scope.config = res;
				})

				app.myApp.http($http, { // 获得大使邀请码
					url: '/member/inviteCode/detail',
					method: 'GET'
				}, function(res){
					$scope.inviteCode = res.data;
				})
			},

            /* invite share*/
            share: function(){
            	// 若邀请码没有请求到
            	if (!$scope.inviteCode) {
            		$.toast("系统繁忙中，请稍后再试。");
            		return;
            	}

                var shareTitle = $scope.config.inviteSenior.title,
                    shareDesc = $scope.config.inviteSenior.text,
                    shareImgUrl = shareImgUrl = location.origin + '/static/img/userCenter/ambCenter/icon_share.png',
                    shareLink = $scope.config.inviteSenior.qrcode + $scope.inviteCode,
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
            },

            /*跳到首页*/
            headRightFn:function(){
            	location.href = '#/home'
            }
		});

		$scope.init();
	}]);

});
