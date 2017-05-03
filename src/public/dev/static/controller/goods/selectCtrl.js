/**商品分类    								控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */

define(['app', 'angular', 'cs!style', 'cs!smCss', 'smJs', 'common/directive/header/header.js', 'cs!static/css/goods/select'], function(app, angular) {

  /*定义 selectCtrl 控制器*/
  app.angular.controller('goods/selectCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    /*设置标题*/
    app.myApp.settitle($rootScope, '商品分类-美妆商城');
    app.myApp.viewport("device");

    /*数据*/
    $scope.id = [1, 2, 16, 20];
    app.myApp.ajax({
        url: "/goods/categoryList"
    }, function(res){
        if (!res.err) {
            res.data[0].active = 'active';
            $scope.data = res.data;
            $scope.$digest();
        } else $.toast(res.errMsg);
    })

    /*切换*/
    $scope.tabFn = function($index) {
    	$($scope.data).each(function(index, item){
    		item.active = '';
    	});

    	$scope.data[$index].active = 'active';
    }

    /*搜索框获得焦点 链接到搜索页*/
    $scope.toSearch = function(){
        location.href = "#/goods/search/0";
    }

    /*搜索跳转*/
    $scope.toGoodsList = function(cid, name) {
        $rootScope.data = null;
        $rootScope.goodsSearch_cid = cid;
        $rootScope.goodsSearch_name = name;
        location.href = "#/goods?cid=" + cid;
    }

  }]);
});