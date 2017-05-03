/**余额明细-美妆商城    					控制器 依赖JS CSS
 * @param   {string} 'app'                 	app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 */

define([
	'app',
	'angular',
	'cs!style',
	'cs!smCss',
	'smJs',
	'pager',
	'/common/directive/header/header.js',
	'/common/directive/tab/tab.js',
	'cs!static/css/userCenter/balance'
],function(app, angular) {

	/* define order/confirmCtrl controller */
	app.angular.controller('userCenter/balanceCtrl', [
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
				app.myApp.settitle($rootScope, '余额明细-美妆商城'); // set title
				app.myApp.viewport("device"); // set viewport

				$scope.type = $stateParams.type;	// 0全部明细 1收入明细 2支出明细
			},

			/* get initialize data */
			initAjax: function() {
				app.myApp.http($http, { //用户等级
                    url: '/member/detail',
                    data: {
                        v: 1.0
                    },
                    method: 'GET'
                }, function(res){
                    $scope.userInfo = res.data;
                });

				app.myApp.http($http, {	// 查询用户余额
					url:'/member/money/balance',
					method:'GET',
				},function(res){
					$scope.balanceAmount = res.data;
				})

				$.pager({	// 用户余额收益明细
                	$scope: $scope,
                	scrollEle: '.content',
                	url: '/member/money/list',
                	http: $http,
                	method: 'GET',
                	data: {
                		income: ['', true, false][$scope.type]	// 收入支出(选填 true false)
                	}
              	});
			},

			/* balance list */
			changeTab: function(index){
				location.hash = '#/userCenter/balance/' + index;
			},

			/* apply withdraw */
			applyWithdraw: function(){
				app.myApp.http($http, {	// 实名认证详情
					url:'/member/idcard/detail',
					method:'GET',
				}, function(res){
					if (res.data && res.data.status == 1)	// 认证成功
						$scope.getCashInfo();
					else
						$scope.applyWithdrawModal();
				})
			},

			/* apply withdraw modal */
			applyWithdrawModal: function(){
				$.modal({
			    	title:  '同学，提现需要先通过实名认证！',
			    	extraClass: 'applyWithdrawModal',
			      	buttons: [
				        {
				          	text: '取消'
				        },
				        {
				          	text: '去认证',
				          	onClick: function() {
				            	location.hash = '#/userCenter/login/realID'
				          	}
				        },
			      	]
			    })
			},

			/**
			 * check if have withdraw count
			 * 老页面中已经判断过是否有提现账号 所以这步判断在后期迁页面的时候打开
			 */
			getCashInfo: function(){
				// app.myApp.http($http, {	// 提现账号详情
				// 	url:'/member/cashInfo',
				// 	method:'GET',
				// }, function(res){
				// 	if (res.data)	// 有提现账号
						location.href = $domain + '/account/withdrawAccount';
				// 	else 	// 设置提现账号
				// 		location.href = $domain + '/account/withdrawAccount';
				// })
			}

		});

		$scope.init();
	}]);

});