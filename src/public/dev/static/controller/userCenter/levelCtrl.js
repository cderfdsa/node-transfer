/**用户等级-美妆商城    					 控制器 依赖JS CSS
 * @param   {string} 'app'                 	app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'cs!sm-extendCss'      sm-extend.min.css
 * @param   {string} 'sm-extendJs'          sm-extend.min.js
 */

define([
	'app',
	'angular',
	'cs!style',
	'cs!smCss',
	'smJs',
	'cs!sm-extendCss',
	'sm-extendJs',
	'/common/directive/header/header.js',
	'cs!static/css/userCenter/level'
], function(app, angular) {

	/*定义 userCenter/levelCtrl 控制器*/
	app.angular.controller('userCenter/levelCtrl', [
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

				/* 初始化静态 $scope */
				staticScope: function() {
					app.myApp.settitle($rootScope, '我的等级-美妆商城'); // 设置 title
					app.myApp.viewport("device"); // 设置viewport

					$scope.type = $stateParams.type;	// 0/1 气质等级/大使等级
				},

				initAjax: function(){
					app.myApp.ajax({	// 用户信息接口
						url: '/account/userInfo',
					}, function(res) {
						if (!res.err) {
							// fix bug: sex's value is 0 in old version
							if (!res.data.user.sex) res.data.user.sex = 1;
							if ($scope.type == 1) {	// 大使等级
								res.data.user.level = res.data.user.seniorMember.level;
							}
							$scope.userInfo = res.data;
							$scope.activeIndex = $scope.userInfo.user.level + 1;
							$scope.$digest();
							if ($scope.type == 0) getUserGrade();
							else {
								app.myApp.http($http, {	// 大使当前等级累计业绩
				                    url: '/member/senior/levelExploit',
				                    method: 'GET'
				                }, function(res){
				                	$scope.totalIncome = res.data || 0;
									getSeniorGrade();
				                });
							}
						} else $.toast(res.errMsg)
					})

					function getUserGrade() {	// 用户等级列表(气质值)
						app.myApp.ajax({
							url:'/account/userGrade'
						}, function(res){
							if(!res.err){
								var expValue = $scope.userInfo.user.expValue || 0;
								$(res.data).each(function(index, item){
									var persent = 100*(expValue-item.min)/(item.max - item.min);
									item.line = (persent > 100 ? 100 : persent < 0 ? 0 : persent) + '%';
								});

								$scope.userGrade = res.data;
								$scope.$digest();
								$scope.levelSwiper();
							} else $.toast(res.errMsg)
						})
					}

					function getSeniorGrade(totalIncome) {	// 大使用户等级
						app.myApp.http($http, {
		                    url: '/member/senior/grade',
		                    method: 'GET'
		                }, function(res){
		                	$(res.data).each(function(index, item){
		                		var persent;
		                		if ($scope.userInfo.user.level > index + 1)	persent = 100;
		                		else
									persent = 100*($scope.totalIncome-item.min)/(res.data[index+1] ? res.data[index+1].min - item.min : 0);
								item.line = (persent > 100 ? 100 : persent < 0 ? 0 : persent) + '%';
							});

							$scope.userGrade = res.data;

							setTimeout(function() {
								$scope.levelSwiper();
							}, 50);
		                });
					}
				},

				/* link to how to grow center */
				headRightFn: function() {
					location.hash = ['#/task/grow', '#/userCenter/ambCenter/explain'][$scope.type];
				},

				/* 滑动插件初始化 */
				levelSwiper: function(className){
					$(".levelSwiper").swiper({
						slidesPerView: 3,
						onClick: function(swiper, event) {
							swiper.slideTo(swiper.clickedIndex - 1);
						},
						onSlideChangeEnd: function(swiper){
							$scope.activeIndex = swiper.activeIndex + 1;
							$scope.$digest();
						},
						initialSlide: $scope.activeIndex - 2
				    });
				},

				/* 特权弹窗 */
				privilegeModal: function(privilege) {
					$.modal({
						title: privilege.name,
						text: '<img src="' + privilege.icon + '!/fw/260">',
						afterText: '<div class="afterText">' + privilege.desc + '</div>',
						extraClass: 'privilegeModal',
						buttons: [{
							text: '<img src="/static/img/userCenter/modal_delete.png">'
						}, {
							text: '已阅'
						}]
					})
				}

			});

			$scope.init();
		}
	]);
});
