/**
 * 1. 在 js 中引入指令： '/common/directive/tab/tab.js'
 * 2. html 中 初始化：<tab tab-texts="['推荐','最新','关注']" tab-active="0" callback="alert()"></tab>
 * 参数：tab-texts 	文字
 * 		 tab-active 初始tab的index
 *    	 callback 	自定义回调函数
 */

define(['app', 'cs!./tab'],function (app) {
    app.angular.directive('tab', function() {
	    return {
	        restrict: 'E',
	        replace: true,
	        scope : {
	            texts : '=tabTexts',
	            active: '=tabActive',
	            callback: '=tabCallback'
	        },
	        template: '<div class="tab_box">' +
						'<span class="tab {{tab.active}}" ng-click="tabFn($index)" ng-repeat="tab in tabs">{{tab.text}}</span>' +
					'</div>',
	        link : function($scope, $element, $attrs) {
	        	/* 构建$scope.tabs对象 */
	        	$scope.tabs = [];
	        	$($scope.texts).each(function(index, item){
	            	$scope.tabs.push({active: index == $scope.active ? 'active' : '', text: item});
	            });

	        	/* tab切换函数 */
	            $scope.tabFn = function($index) {
	            	$($scope.tabs).each(function(index, item){
	            		if ($index == index) item.active = 'active';
	            		else item.active = '';
	            	});

	            	/*自定义回调函数*/
	        		$scope.callback && $scope.callback($index);
	            }
	        }
	    };
	});
});
