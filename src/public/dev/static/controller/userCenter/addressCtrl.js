/**我的收货地址-美妆商城                    控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 * @param   {string} 'moment'               moment.js
 */

define(['app', 'angular', 'moment', 'cs!smCss', 'smJs', 'pager', 'lazyLoad', '/common/directive/header/header.js', 'cs!static/css/userCenter/address'], function(app, angular, moment) {
	/*定义 addressCtrl 控制器*/
	app.angular.controller('userCenter/addressCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
		/*设置标题*/
		app.myApp.settitle($rootScope, '我的收货地址-美妆商城');
		app.myApp.viewport("device");
		$scope.domain = $domain;

		$scope.pageType = $stateParams.type;

		/*用户所有地址信息*/
		$scope.addressInfo = function() {
			app.myApp.ajax({
				url: '/account/address',
			}, function(res) {
				if (!res.err) {
					$scope.addresses = res.data;
					if (res.data.length != 0) {
						$scope.default = 'defaultclass';
						res.data.forEach(function(item) {
							if (item.isDefault) $scope.defaultID = item._id;
						});
					}
					$scope.$digest();
				} else $.toast(res.err)
			})
		}
		$scope.addressInfo();

		/*设置默认*/
		$scope.info = function(list) {
			app.myApp.ajax({
				url: '/account/setDefaultAddress',
				data: {
					addr_id: list._id
				}
			}, function(res) {
				if (!res.err) {
					$scope.default = res.data;
					$scope.defaultID = list._id;
					$scope.default = 'defaultclass';
					$scope.$digest();
				} else $.toast(res.err)
			})
		}

		/*删除地址*/
		$scope.delete = function($event, address) {
			$event.stopPropagation();

			//删除接口
			var delAddress = function() {
				app.myApp.ajax({
					url: '/account/delAddress',
					data: {
						addr_id: address._id
					}
				}, function(res) {
					if (!res.err) {
						$scope.$digest();
						$.toast('已删除地址');
						$scope.addressInfo();
					} else $.toast(res.err);
				})
			}
			var addressModal = $.modal({
				title: "确定要删除该收货地址吗",
				text: '<div class="popup_container">' +
					'<div class="customize_popup">' +
					'</div>' +
					'</div>',
				extraClass: 'addressModal',
				buttons: [{
					text: "取消",
					close: false,
					onClick: function() {
						$.closeModal(addressModal);
					}
				}, {
					text: "确认",
					close: false,
					onClick: function() {
						delAddress();
						$.closeModal(addressModal);

					}
				}]
			})
		}

		/*修改地址*/
		$scope.change = function($event, address) {
			$event.stopPropagation();

			localStorage.addressType = address.type;
			location.href = '#/userCenter/addressEdit'
					+ '?id=' + address._id;
		}

		/*添加地址*/
		$scope.addAddress = function() {
			location.href = '#/userCenter/addressEdit';
		}

		/* 选择地址 */
		$scope.selectFn = function($index){
			if ($scope.pageType != 'select') return;

			$rootScope.selectAddress = $scope.addresses[$index];
			history.back();
		}
	}]);
});