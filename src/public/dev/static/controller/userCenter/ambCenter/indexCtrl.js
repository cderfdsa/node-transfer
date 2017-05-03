/**大使中心-美妆商城    					  控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'cs!css/sm-extendCss'  sm-extend.min.css
 * @param   {string} 'sm-extendJs'          sm-extend.min.js
 * @param   {string} 'pager'                pager.js
 * @param   {string} 'moment'               moment.js
 */

define([
	'app',
	'angular',
	'moment',
	'cs!style',
	'cs!smCss',
	'cs!sm-extendCss',
	'sm-extendJs',
	'smJs',
	'cs!sm-extendCss',
	'sm-extendJs',
	'pager',
	'/common/directive/header/header.js',
	'cs!static/css/userCenter/ambCenter/index'
], function(app, angular, moment){

	/*定义 userCenter/ambCenter/indexCtrl 控制器*/
	app.angular.controller('userCenter/ambCenter/indexCtrl', [
		'$rootScope',
		'$scope',
		'$state',
		'$stateParams',
		'$http',
		function($rootScope, $scope, $state, $stateParams, $http) {
			$.extend($scope, {
				init: function() {
					this.staticScope();
					this.isVisited();
					this.initAjax();
				},

				staticScope: function() {
					/*设置标题*/
					app.myApp.settitle($rootScope, '大使中心-美妆商城');
					app.myApp.viewport("device");
					$scope.domain = $domain;
					$scope.showPart = 0;
				},

				initAjax: function() {
					var self = this;

					app.myApp.http($http,{
						url:'/banner/2/list',/*banner*/
						method:'GET',
					},function(res){
						$scope.banners = res.data;
						setTimeout(function(){
							self.initSwiper();
						}, 50)
					});

					app.myApp.http($http,{
						url:'/member/detail', /*用戶信息*/
						method:'GET',
					},function(res){
						$scope.userInfo = res.data;
					});

					app.myApp.http($http,{
						url:'/member/senior/stat',/*收益信息*/
						method:'GET',
					},function(res){
						$scope.data = res.data;
					});

					app.myApp.http($http,{
						url:'/member/duiba/url',/*大使积分兑换url*/
						method:'GET',
						data: {
							senior: true
						}
					},function(res){
						$scope.duibaUrl = res.data;
					});

					$scope.img = [
						{
							link:'level'
						},
						{
							link:'banner'
						},
						{
							link:'invite'
						},
						{
							link:'inviteBonus'
						}
					]
				},
				// banner 滑動插件
				initSwiper: function() {
			        $(".swiper-banner").swiper({
			          autoplay: 4000, // delay between transitions
			          autoplayDisableOnInteraction: false, // Set to false and autoplay will not be disabled after user interactions
			          pagination: '.swiper-pagination' //分页 class
			        });
			     },

			    //判断是否第一次登陆
				isVisited: function(){
					$scope.ambGuide = !localStorage.ambGuide;
					if(!localStorage.ambGuide) localStorage.ambGuide = true;
			     },

			     /*引导页*/
			    showNext: function(){
			     $scope.showPart ++;
			    },

			});
		$scope.init();
		}
	]);
});
