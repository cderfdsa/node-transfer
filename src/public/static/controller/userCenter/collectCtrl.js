/**种草单-美妆商城    					    控制器 依赖JS CSS
 * @param   {string} 'app'                 	app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 */

define([
	'app',
	'angular',
	'cs!style',
	'cs!smCss',
	'smJs',
    'lazyLoad',
	'/common/directive/header/header.js',
	'cs!static/css/userCenter/collect'
], function(app, angular) {

	/* define userCenter/collectCtrl controller */
    app.angular.controller('userCenter/collectCtrl', [
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
                app.myApp.settitle($rootScope, '种草单-美妆商城'); // set title
                app.myApp.viewport("device"); // set viewport
            },

            /* get initialize data */
            initAjax: function() {
                app.myApp.http($http, {	// 种草单
                    url: '/member/favorite/list',
                    method: 'GET'
                }, function(res){
                    $scope.favoriteLists = res.data;
                    setTimeout('$(".lazy").lazyLoad()', 50);
                });
            },

            /* delete favorite goods */
            delete: function($index){
                app.myApp.http($http, {    // 删除种草
                    url: '/member/favorite/save',
                    data: {
                        product: $scope.favoriteLists.rows[$index]._id // 商品ID(必填)
                    }
                }, function(res){
                    $.toast("删除成功！")
                    $scope.favoriteLists.rows.splice($index, 1);
                });
            }

		});

		$scope.init();
	}]);
});
