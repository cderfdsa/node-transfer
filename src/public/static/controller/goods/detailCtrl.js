/**商品详情                                 控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
  * @param   {string} 'cs!style'            style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'cs!sm-extendCss'      sm-extend.min.css
 * @param   {string} 'sm-extendJs'          sm-extend.min.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 * @param   {string} 'share'             	share.js
 * @param   {string} 'animateCss'           animate.css
 */

define([
	'app',
	'angular',
	'share',
	'cs!style',
	'cs!smCss',
	'smJs',
	'cs!sm-extendCss',
	'sm-extendJs',
	'lazyLoad',
	'cs!animateCss',
	'common/directive/header/header.js',
	'cs!static/css/goods/detail'
], function(app, angular, share) {

	/* define goods/detailCtrl controller */
	app.angular.controller('goods/detailCtrl', [
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
				this.sentShareKey();
			},

			/* initialize static $scope */
			staticScope: function() {
				app.myApp.viewport("device");   // set viewport
				$scope.proId = $stateParams.proId;	// 商品id
				$scope.headerForm = location.search.replace(/\?from\=/g, '') != 'app';

				$scope.No = 1;
				$scope.cutStatus = 'disabled';
			},

			/* get initialize data */
			initAjax: function() {
				// 商品详情
				app.myApp.http($http, {
					url: '/product/' + $stateParams.proId + '/detail',
					method: 'GET'
				}, function(res){
					// 设置标题
					app.myApp.settitle($rootScope, res.data.name + '-美妆商城');
					$scope.data = res.data;
					// 获取商品总数
					$scope.inventoryAll = 0;
					$($scope.data.standards).each(function(index, item) {
						$scope.inventoryAll += item.inventory;
						if (item.inventory) {
							item.focus = 'focus';
							$scope.standardsIndex = index;
							$scope.inventory = item.inventory;
							return false;
						}
					});

					$('.goods_detail_list').html($scope.data.desc)

					var interval = setInterval(function(){
						if ($(".goods_detail_list img").length) {
							clearInterval(interval);
							// 给所有img标签添加默认图片和 lazySrc 属性后 进行懒加载
							$(".goods_detail_list img").map(function() {
								$(this).attr("lazySrc", $(this).prop("src"))
								.prop("src", "/static/img/loading-200.jpg");
							});
							$(".goods_detail_list img").lazyLoad();

							// banner slider
							if ($scope.data.images.length > 1) $scope.initSwiper();

							// 特卖倒计时
							if ($scope.data.event) $scope.countDown();
						}
					}, 100);
				});

				// 购物车数量
				app.myApp.http($http, {
					url: '/member/cart/total',
					method: 'GET'
				}, function(res){
					$scope.cartNums = res.data;
				});

				// 商品评论统计
				app.myApp.http($http, {
					url: '/product/comment/stat',
					method: 'GET',
					data: {
						product: $stateParams.proId
					}
				}, function(res){
					$scope.totalComment = res.data;
				});

				// 商品评论列表(只显示一条、0则整条不显示)
				app.myApp.http($http, {
					url: '/product/comment/list',
					method: 'GET',
					data: {
						product: $stateParams.proId,
						type: 1 //好评
					}
				}, function(res){
					$scope.comment = res.data;
				});

				// 检查商品种草
				app.myApp.http($http, {
					url: '/member/favorite/product/' + $stateParams.proId + '/check',
					method: 'GET'
				}, function(res){
					$scope.isCollect = res.data;
				});

				 // 获取分享KEY
				app.myApp.http($http, {
					url: '/member/senior/share'
				}, function(res){
					$scope.shareKey = res.data;
				});

				// 用户信息
				if (app.myApp.iniValue.isLogin) {
					app.myApp.http($http, {
						url: '/member/detail',
						data: {
							v: 1.0
						},
						method: 'GET',
						loading: false
					}, function(res){
						$scope.userInfo = res.data;
					});
				}
			},

			/* 特卖商品打折倒计时 */
			countDown: function(){
				var endTime = $scope.data.event.endTime - new Date().getTime();
				if (endTime < 0) return;	// 过期直接显示0

				var interval = setInterval(function(){
					$scope.day = parseInt(endTime/(24*60*60*1000));	// 天
					$scope.hh = parseInt(endTime%(24*60*60*1000)/(60*60*1000));	// 时
					$scope.mm = parseInt(endTime%(60*60*1000)/(60*1000));	// 分
					$scope.ss = parseInt(endTime%(60*1000)/1000);	// 秒
					$scope.ms = parseInt(endTime%1000/100);	// 毫秒/100
					if ($scope.hh < 10) $scope.hh = '0' + $scope.hh;
                    if ($scope.mm < 10) $scope.mm = '0' + $scope.mm;
                    if ($scope.ss < 10) $scope.ss = '0' + $scope.ss;
					$scope.$digest();
					if (endTime <= 0) clearInterval(interval);
					endTime -= 100;
				}, 100);
			},

			/* 购物弹框
			 * e = 0/1 加入购物车/立即购买
			 */
			buyModalFn: function(type, e) {
				$scope.popupClass = type == 'close' ? 'slideDown' : 'slideUp';
				app.myApp.cnzz('cartAdd');

				$scope.e = e;
			},

			/* 规格选择 */
			specificationFn: function($index) {
				if (!$scope.data.standards[$index].inventory) return;
				$($scope.data.standards).each(function(index, item) {
					item.focus = '';
				})
				$scope.data.standards[$index].focus = 'focus';
				$scope.standardsIndex = $index;
				$scope.inventory = $scope.data.standards[$index].inventory;
			},

			/* 加减购买数目 */
			cutFn: function() {
				if ($scope.No > 1) $scope.No --;
				$scope.cutStatus = $scope.No == 1 ? 'disabled' : '';
				$scope.addStatus = '';
			},

			addFn: function() {
				if (!$scope.inventory) {
					$.toast('请选择商品规格');
					return;
				}
				if ($scope.inventory && $scope.No < $scope.inventory) $scope.No ++;
				$scope.addStatus = $scope.No == $scope.inventory ? 'disabled' : '';
				$scope.cutStatus = '';
			},

			/* 选择商品确认 */
			selectedFn: function() {
				if (!$(".specification .focus").length) {
					$.toast('请选择规格');
					return;
				}

				$scope.popupClass = 'slideDown';

				if ($scope.e == 0) 		//购物车
					$scope.addCart();
				else if ($scope.e == 1)	//立即购买
					$scope.isProCanBuy();
			},

			/* 添加商品至购物车 */
			addCart: function(){
				// 判断是否登录
				if (!app.myApp.iniValue.isLogin()) {
					$scope.ifoginModal();
					return;
				}

				app.myApp.http($http, {
					url: '/member/cart/add',
					data: {
						productId: $stateParams.proId,	// 商品ID(必填)
						standardId: $scope.data.standards[$scope.standardsIndex].id,	// 规格ID(必填)
						qty: $scope.No	// 数量(选填，默认1)
					}
				}, function(res){
					$($scope.data.standards).each(function(index, item) {
						item.focus = '';
					});
					$.toast('<img src="/static/img/goods/mw_toast_success.png">已成功加入购物车了哦~', '2000', 'mw_toast_success');
					$scope.cartNums += $scope.No;
					$scope.No = 1;
				});
			},

			/* 立即购买 2.0移除 暂未删 */
			isProCanBuy: function(){
				var products = [{
					product: addCartData.proid, //商品id
					standard: addCartData.standardId, // 规格ID
					qty: addCartData.qty // 数量
				}]

				$.toast('订单确认中,请稍后···');
				app.myApp.ajax({
					url: '/order/isProCanBuy',
					data: {
						'products': products
					}
				}, function(res) {
					if (!res.err) {
						localStorage.orderConfirmProducts = JSON.stringify(res.data);
						location.href = '#/order/confirm/0';
					} else if (res.err == -1) {
						$.modal({
							title: res.errMsg,
							extraClass: 'modal_confirm',
							buttons: [{
								text: '取消'
							}, {
								text: '去登录',
								onClick: function() {
									location.href = $domain + res.data;
								}
							}]
						});
					} else {
						$.toast(res.errMsg);
					}
				});
			},

			/* get initialize swiper */
			initSwiper: function(){
				// banner 滑动插件
			    $(".banner").swiper({
			    	autoplay: 4000,  // delay between transitions
			      	autoplayDisableOnInteraction: false,  // Set to false and autoplay will not be disabled after user interactions
			      	pagination: '.swiper-pagination'  //分页 class
			    });
			},

			/* 评论过长 显隐 */
			showCommentFn: function($index) {
				$scope.comment.rows[$index].commentBtnStatus = !$scope.comment.rows[$index].commentBtnStatus;
			},

			/* 是否登录弹窗 */
			ifoginModal: function(){
				// 未登录
				$.modal({
					title: '您还未登录哦，确认去登录吗？',
					extraClass: 'modal_confirm',
					buttons: [{
						text: '取消'
					}, {
						text: '去登录',
						onClick: function() {
							app.myApp.ifLogin();
						}
					}]
				});
			},

			// 收藏
			collectFn: function() {
				// 判断是否登录
				if (!app.myApp.iniValue.isLogin()) {
					$scope.ifoginModal();
					return;
				}

				// 已登录 请求收藏接口
				app.myApp.http($http, {
					url: '/member/favorite/save',
					data: {
						product: $stateParams.proId
					},
					loading: false
				}, function(res){
					$scope.isCollect = !$scope.isCollect;
				});
			},

			/* share */
			share: function(){
				var shareTitle = $scope.data.name,
		            shareDesc = $scope.data.introduction,
		            shareImgUrl = "http://img.beautysite.cn" + $scope.data.images[0],
		            shareLink = $domain+'/goods/detail/' + $scope.data._id + '?shareKey=' + $scope.shareKey,
		            callback = {
		                success: function() {
		                	$(".wxfx").remove();
		                    $scope.shareSuccess();
		                }
		            };

		        share.setContent(shareTitle, shareDesc, shareImgUrl, shareLink, callback);
		        share.popupShare();

		        $("body").delegate(".modal-overlay", "click", function() { // close tip modal
		            $.closeModal();
		        });
			},

			/* 商品分享成功回调 */
			shareSuccess: function(){
				app.myApp.http($http, {
					url: '/member/product/' + $stateParams.proId + '/share',
					data: {
						v: '1.0'
					}
				}, function(res) {
					$.completeTaskModal(res.data.missionTip);
					app.myApp.recordShare($http, 0, 0);
				});
			},

			/* 访问分享后的页面 发送sharekey */
			sentShareKey: function(){
				if ($stateParams.shareKey) {
					if (app.myApp.iniValue.isLogin()) {	// 登录
						app.myApp.http($http, {
							url: '/member/share/visit',
							defaultResErr: false,
							data: {
								shareKey: $stateParams.shareKey
							}
						}, function(){
							localStorage.removeItem('shareKey');
							localStorage.removeItem('shareKey_expire');
						})
					} else {	// 未登录 储存sharekey 7天后过期
						localStorage.shareKey = $stateParams.shareKey;
						localStorage.shareKey_expire = new Date(new Date().getTime() + 7 * 24 * 3600 * 1000).getTime();
					}
				}
			},

			// 分享后 返回到首页
			leftFn: function() {
				if ($stateParams.shareKey || history.length < 2) location.hash = '#/home';
				else history.back()
			}
		});

		$scope.init();
	}]);
});
