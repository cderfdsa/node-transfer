/**
 * 1. 在 js 中引入指令： '/common/directive/header/header.js'
 * 2. html 中 初始化：<heade class="community_list_header" head-title="'女神说'" head-lefttext="'123'" head-righttext="'123'" head-leftfn="headLeftFn"></heade>
 * 参数：head-title 	标题
 * 		 head-lefttext 	左按钮文字
 * 		 head-leftfn 	左按钮回调
 * 		 head-righttext 右按钮文字
 * 		 head-rightfn 	右按钮回调
 * 		 head-scroll	开始隐藏 上滑渐显效果
 */

define(['app', 'cs!./header'],function (app) {
    app.angular.directive('heade', function() {
	    return {
	        restrict: 'E',
	        replace: true,
	        scope : {
	            lefttext : '=headLefttext',
	            leftfn : '=headLeftfn',
	            title: '=headTitle',
	            righttext : '=headRighttext',
	            rightfn : '=headRightfn',
	            scroll: '=headScroll'
	        },
	        template: '<header class="bar bar-nav" ng-show="headerForm">' +
	        			'<div class="bg {{scroll?\'scroll\':\'\'}}"></div>' +
						'<span class="icon {{lefttext?\'\':\'icon-left\'}} pull-left" ng-click="leftfnn()">{{lefttext}}</span>' +
						'<a class="icon pull-right" href="javascript:void(0);" ng-click="rightfn()">{{righttext}}</a>' +
						'<h1 class="title">{{title}}</h1>' +
					'</header>',
	        link : function($scope, $element, $attrs) {
	        	// 当 url 为 document.domain/?form=app#/xxx 时（在app中），隐藏头部
	        	$scope.headerForm = $.getParam("from") != 'app';

	        	$scope.leftfnn = function(){
	        		$scope.leftfn ? $scope.leftfn() : history.go(-1);
	        	}

	        	/* 上滑渐显 */
	        	if ($scope.scroll) {
	        		var opacity = 0;
	        		$(".content").scroll(function(){
	        			opacity = $(this).scrollTop()/176;
	        			if (opacity > 1) opacity = 1;
	        			$("header .scroll").css("opacity", opacity);
	        		});
	        	}
	        }
	    };
	});
});
