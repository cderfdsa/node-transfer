/**个人中心-美妆商城    						控制器 依赖JS CSS
 * @param   {string} 'app'                 	 app.js
 * @param   {string} 'angular'             	 angular.min.js
 * @param   {string} 'cs!style'        		 style.css
 * @param   {string} 'cs!smCss'         	 sm.min.css
 * @param   {string} 'smJs'                  sm.min.js
 */

define([
	'app',
	'angular',
	'cs!style',
	'cs!smCss',
	'smJs',
	'/common/directive/header/header.js',
	'/common/directive/footer/footer.js',
	'cs!static/css/userCenter/index'
], function(app, angular) {

	/*定义 indexCtrl 控制器*/
	app.angular.controller('userCenter/indexCtrl', [
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
					app.myApp.settitle($rootScope, '个人中心-美妆商城'); // set title
					app.myApp.viewport("device"); // set viewport
					$scope.domain = $domain;	// set domain

					if (app.myApp.ifLogin(location.hash, '#/home') == false) return;
					$scope.userCenterAmbGuide = !localStorage.userCenterAmbGuide;
				},

				/* get initialize data */
				initAjax: function() {
					app.myApp.http($http, {	//获取用户信息
	                    url: '/member/detail',
	                    data: {
	                        v: 1.0
	                    },
	                    method: 'GET',
						defaultResErr: false
	                }, function(res){
						if (!res.err) {
							$scope.data = res.data;

							if ($scope.data) {
								$rootScope.toMycomment_photo = $scope.data.headImg;
								$rootScope.toMycomment_nickName = $scope.data.nickName;
								$rootScope.toMycomment_level = $scope.data.seniorMember ? ("s" + $scope.data.seniorMember.level) : "v" + $scope.data.level;
							}
							/*完善资料弹窗*/
							$scope.fullInfoModal(res.data);
							/*带到我的评论中的头像、姓名、等级*/
						} else $scope.notSignIn = true;
	                });


					app.myApp.http($http, { //社区用户信息 - 商城
	                    url: '/member/community/user/stat',
	                    method: 'GET'
	                }, function(res){
						$scope.CommunityStat = res.data;
	                });

					app.myApp.http($http, { //用户未读消息统计
	                    url: '/member/community/notify/unread',
	                    method: 'GET'
	                }, function(res){
						$scope.msg = res.data;
	                });

	                // 兑吧兑换记录链接
		            app.myApp.http($http, {
		                url: '/member/duiba/record',
		                method: 'GET'
		            }, function(res){
		                $scope.duibaRecord = res.data;
		            });
				},

				/*去等级页面*/
				toLevel: function(type){
					location.href = '#/userCenter/level/'+ type;
				},

				/* 提示补全资料弹层 */
				fullInfoModal: function(user) {
					if (!(user && user.headImg && user.nickName && user.birthday && user.school && user.schoolYear) && !localStorage.openedFullInfoModal) {
						$.modal({
							text: '<img src="/static/img/community/modal-fullInfo.png">',
							extraClass: 'modal-fullInfo',
							buttons: [{
								text: '<img src="/static/img/community/modal-fullInfo-close.png">'
							}, {
								text: '<img src="/static/img/community/modal-fullInfo-btn0.png">'
							}, {
								text: '<img src="/static/img/community/modal-fullInfo-btn1.png">',
								onClick: function() {
									location.href = '#/userCenter/userInfo';
								}
							}]
						});
						localStorage.openedFullInfoModal = true;
					}
				},

				/* 领取红包弹窗 */
				// redPacketFn: function() {
				// 	app.myApp.ajax({
				// 		url: '/account/receiveMonthPresent'
				// 	}, function(res) {
				// 		if (!res.err) {
				// 			// 优惠券金额处理
				// 			var redPacketNo = 0;
				// 			$(res.data).each(function(index, item) {
				// 				redPacketNo += item.value;
				// 			});
				// 			$.modal({
				// 				title: '<span>' + redPacketNo + '</span>元',
				// 				text: '恭喜获得月度优惠券',
				// 				extraClass: 'redPacketModal',
				// 				buttons: [{
				// 					text: '立即查看',
				// 					close: true,
				// 					onClick: function() {
				// 						location.href = '#/userCenter/redPacket/0';
				// 					}
				// 				}]
				// 			});
				// 		} else $.toast(res.errMsg);
				// 	})
				// },

				/* 大使新手引导（第一次进入页面） */
				isVisitedAmbGuide: function(){
					$scope.userCenterAmbGuide = false;
					if(!localStorage.userCenterAmbGuide)
						localStorage.userCenterAmbGuide=true;
						location.href = '#/userCenter/ambCenter';
				},

				/*海报入口*/
				want:function(type){
					if(type==1){
						location.href='#/userCenter/ambCenter/poster';
					}else{
						location.href='#/userCenter/ambCenter/special'
					}
				}

			});

			$scope.init();

	}]);
});
