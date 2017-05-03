/**红包说明-美妆商城    					控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'moment'               moment.js
 */

define([
	'app',
	'angular',
	'moment',
	'cs!smCss',
	'smJs',
	'/common/directive/header/header.js',
	'cs!static/css/userCenter/redPacketExplain'
], function(app, angular,moment) {

  /*定义 redPacketExplain 控制器*/
  	app.angular.controller('userCenter/redPacketExplainCtrl', [
	  	'$rootScope',
	  	'$scope',
	  	'$state',
	  	'$stateParams',
	  	'$http',
	function($rootScope, $scope, $state, $stateParams, $http) {

	    app.myApp.settitle($rootScope, '红包说明-美妆商城');	// 设置标题
	    app.myApp.viewport("device");

  	}
  ]);
});