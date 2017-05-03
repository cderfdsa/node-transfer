/**建议反馈-美妆商城    						控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */

define(['app', 'angular', 'cs!smCss', 'smJs', '/common/directive/header/header.js', 'cs!static/css/userCenter/suggest'], function(app, angular) {

  /*定义 suggestCtrl 控制器*/
  app.angular.controller('userCenter/suggestCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    /*设置标题*/
    app.myApp.settitle($rootScope, '建议反馈-美妆商城');
    // 设置 device
    app.myApp.viewport("device");

	// 反馈类型
	$scope.widgets = [{
		name: '体验问题'
	},{
		name: '订单问题'
	},{
		name: '大使问题'
	},{
		name: '其他'
	}];

	/*checkbox状态*/
	$scope.checkFn = function($index){
		if ($scope.widgets[$index].checked) {
			$scope.widgets[$index].checked = '';
			$scope.type = '';
		} else {
			$($scope.widgets).each(function(index, item) {
				item.checked = '';
			});

			$scope.widgets[$index].checked = 'checked';
			$scope.type = $index + 1;
		}
	}

	// textarea 限制100个
	$scope.textAreaFn = function(){
		if ($scope.areaText.length >= 100) {
			$scope.areaText = $.trim($scope.areaText.split("").slice(0,100).join(""));
		}
	}

	$scope.submmitFn = function() {
		if (!($scope.type && $scope.areaText.length>1)) return;
		/*提交*/
		app.myApp.ajax({
			url: '/account/feedback',
			data: {
				type: $scope.type,
				content: $.trim($scope.areaText)
			}
		}, function(res) {
			if (!res.err) {
				$.toast('<img src="/static/img/userCenter/toast_success.png">提交成功！', 2000, 'toast_success');
				setTimeout(function(){location.href = "#/userCenter";}, 2000);
			} else $.toast(res.errMsg);
		})
	}

  }]);
});