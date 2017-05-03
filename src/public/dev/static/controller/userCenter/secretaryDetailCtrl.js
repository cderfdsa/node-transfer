/**美妆秘书-详情-美妆商城    						          控制器 依赖JS CSS
 * @param   {string} 'app'                  	app.js
 * @param   {string} 'angular'              	angular.min.js
 * @param   {string} 'cs!style'        			  style.css
 * @param   {string} 'cs!smCss'         		  sm.min.css
 * @param   {string} 'smJs'                 	sm.min.js
 */

define(['app', 'angular', 'cs!style', 'cs!smCss', 'smJs','/common/directive/header/header.js', 'cs!static/css/userCenter/secretaryDetail'], function(app, angular) {

  /*定义 secretaryDetailCtrl 控制器*/
  app.angular.controller('userCenter/secretaryDetailCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
   $.extend($scope, {
      init: function() {
        this.staticScope();
      },

      /* 初始化静态 $scope */
      staticScope: function() {
        app.myApp.settitle($rootScope, '详情-美妆商城'); // 设置 title
        app.myApp.viewport("device"); // 设置viewport
      }
    });

    $scope.init();

  }]);
});
