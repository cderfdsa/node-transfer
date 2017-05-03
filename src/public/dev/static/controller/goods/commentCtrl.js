/**商品评论    								              控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'             	  pager.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 * @param   {string} 'moment'               moment.js
 */

define(['app', 'angular', 'moment', 'pager', 'cs!smCss', 'smJs', 'lazyLoad', '/common/directive/header/header.js', 'cs!static/css/goods/comment'], function(app, angular, moment) {

  /*定义 commentCtrl 控制器*/
  app.angular.controller('goods/commentCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    /*设置标题*/
    app.myApp.settitle($rootScope, '商品评论');
    app.myApp.viewport("device");
    $scope.headerForm = location.search.replace(/\?from\=/g, '') != 'app';

    /*获取商品统计*/
  	app.myApp.ajax({
  		url: '/goods/commentStat',
  		data: {
  			product: $stateParams.proId
  		}
  	}, function(res) {
  		if (!res.err) {
  			$scope.totalComment = res.data;
  			$scope.$digest();
  		} else $.toast(res.errMsg);
  	});
   	
   	/*获取商品评论, 分页*/
   	$.pager({
   		$scope: $scope,
   		lazyEle: '.lazy',
   		scrollEle: '.content',
   		repeatEle: 'li',
  		page: 0,
  		url: '/goods/commentList',
  		data: {product: $stateParams.proId},
      callBack: function(res) {
        $(res.data.rows).each(function(index, item ){
          item.textComment = item.textComment.trim();
          item.updatedAt = moment(item.updatedAt).format('YYYY-MM-DD');
        });

        if ($scope.data) $scope.data.rows = $scope.data.rows.concat(res.data.rows);
        else $scope.data = res.data;
        $scope.$digest();
      }
   	});
    
  }]);
});