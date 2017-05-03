/**美妆合肥试点产品活动-美妆商城    		控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!smCss'         	sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */

define(['app', 'angular', 'cs!smCss', 'smJs', 'cs!animateCss', 'cs!static/css/activity/pilotProduct'], function(app, angular) {

  /*定义 pilotProductCtrl 控制器*/
  app.angular.controller('activity/pilotProductCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    /*设置标题*/
    app.myApp.settitle($rootScope, '全国首家互联网+美妆体验平台-美妆商城');

    // 设置 device
    app.myApp.viewport("device");

    // 设置 domain
	$scope.domain = $domain;

    /*初始化数据*/
    app.myApp.ajax({
    	url: '/site/summerHotGoodsList'
    }, function(res){
        if (!res.err) {
            // 前两个数据分离出来
            $scope.data = res.data;
            $scope.array1 = res.data.slice(2, res.data.length);
            $scope.$digest();
        } else $.toast(res.errMsg);
    });

	/* 底部显隐 */
	$scope.showFotter = function(){
		$scope.status = false;
		$($scope.data).each(function(index, item){
			if (item.checked) $scope.status = true;
		});
	};
	$scope.showFotter();

	/* 勾选联动 */
	$scope.updateNo = function(){
        /*
         * money: 总价/saveMoney:省去的费用/num:数目
         */
		$scope.money = $scope.saveMoney = $scope.num = 0;

		$($scope.data).each(function(index, item){
			if (item.checked) {
				$scope.money += item.price;
				$scope.saveMoney += item.marketPrice - item.price;
				$scope.num ++;
			}
		});
	};
	$scope.updateNo();

	/* 点击选择按钮 */
	$scope.checkboxFn =  function($index, arr){
        if (arr) $scope.array1[$index].checked = $scope.data[$index + 2].checked = !$scope.data[$index + 2].checked;
        else $scope.data[$index].checked = !$scope.data[$index].checked;
		$scope.showFotter();
		$scope.updateNo($index, arr);
	};

	/* 结算 */
	$scope.settlement = function(){
		if (!$scope.num) {
            $.toast('请勾选商品');
            return;
        }
        var orderProducts = [];
        $($scope.data).each(function(index, item) {
            if (item.checked) {
                orderProducts.push({
                    'product': item._id,            //商品id
                    'standard': item.standards.id,  //规格id
                    'qty': 1                        //数量
                });
            }
        });

        $.toast('结算中...');

        app.myApp.http($http, { // 下单前检查
            url: '/member/order/check',
            data: {
                orderProducts: orderProducts,
                isCart: false
            },
            loading: false
        }, function(res){
            localStorage.orderConfirmProducts = JSON.stringify(res.data);
            location.href = '#/order/confirm/0';
        });
	};
  }]);
});
