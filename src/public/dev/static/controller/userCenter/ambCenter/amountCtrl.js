/**业绩/收益-美妆商城    					控制器 依赖JS CSS
 * @param   {string} 'app'                 	app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'chart'                Chart.min.js
 */

define([
	'app',
	'angular',
	'cs!style',
	'cs!smCss',
	'smJs',
	'chart',
	'/common/directive/header/header.js',
	'cs!static/css/userCenter/ambCenter/amount'
],function(app, angular) {

	/* define order/confirmCtrl controller */
	app.angular.controller('userCenter/ambCenter/amountCtrl', [
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
				$scope.tab = ['exploit', 'income'].indexOf($stateParams.tab);
				app.myApp.settitle($rootScope, ['业绩', '收益'][$scope.tab] + '-美妆商城'); // set title
				app.myApp.viewport("device"); // set viewport
			},

			/* get initialize data */
			initAjax: function() {
				app.myApp.http($http, {
					url: ['/member/exploit/stat', '/member/money/totalIncome/list'][$scope.tab],
					method: 'GET'
				},function(res){
					$scope.amountData = res.data;
					$scope.drawChat();
				})
			},

			/*to explain detail*/
			explainLink: function(){
				location.hash = '#/userCenter/ambCenter/explain';
			},

			/*to amount detail*/
			amountDetailLink: function(screen, frozen){
				location.hash = '#/userCenter/ambCenter/' +
					['achievementDetail', 'incomeDetail'][$scope.tab] +
					((screen != undefined || frozen != undefined) ? '?' : '') +
					(screen != undefined ? 'type=' + screen : '') +
					((screen != undefined && frozen != undefined) ? '&' : '') +
					(frozen != undefined ? 'frozen=' + frozen : '')
			},

			/* draw chart */
			drawChat: function(){
				var totalAmount = [$scope.amountData.totalExploit, $scope.amountData.totalIncome][$scope.tab];

				var ctx = $("#myChart").get(0).getContext("2d"),
					datasets;

				if ($scope.tab == 0)
					datasets = {
		                data: [
							totalAmount == 0 ? 100 : 0,
		                    ($scope.amountData.indirectExploit/totalAmount*100).toFixed(2),
		                    ($scope.amountData.inviteExploit/totalAmount*100).toFixed(2),
		                    ($scope.amountData.directExploit/totalAmount*100).toFixed(2),

		                ],
		                backgroundColor: [
							"#ccc",
		                    "#d8cdfb",
		                    "#7cccf6",
		                    "#ff94b9",
		                ]
				    }
				else  datasets = {
	                data: [
						totalAmount == 0 ? 100 : 0,
	                    ($scope.amountData.detailIncome.inviteAmbaIncome/totalAmount*100).toFixed(2),
	                    ($scope.amountData.detailIncome.indirectIncome/totalAmount*100).toFixed(2),
	                    ($scope.amountData.detailIncome.directIncome/totalAmount*100).toFixed(2),
	                    ($scope.amountData.detailIncome.representIncome/totalAmount*100).toFixed(2),
	                    ($scope.amountData.detailIncome.inviteMemberIncome/totalAmount*100).toFixed(2),
	                    ($scope.amountData.detailIncome.taskIncome/totalAmount*100).toFixed(2),
	                ],
	                backgroundColor: [
						"#ccc",
	                    "#7bccf6",
	                    "#b8a5f7",
	                    "#ff94b9",
	                    "#ffc24b",
	                    '#94df90',
	                    '#67decc',
	                ]
	            };

				var config = {
			        type: 'doughnut',
			        data: {
			            datasets: [datasets, {
			                hidden: false,
			                data: []
			            }],
			            labels: false
			        }
		    	};

				var myNewChart = new Chart(ctx, config);

			}


		});

		$scope.init();
	}]);
});
