/**商品搜索    								控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */

define(['app', 'angular', 'cs!style', 'cs!smCss', 'smJs', 'cs!static/css/goods/search'], function(app, angular) {

  /*定义 searchCtrl 控制器*/
  app.angular.controller('goods/searchCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    /*设置标题*/
    app.myApp.settitle($rootScope, '商品搜索-美妆商城');
    app.myApp.viewport("device");

    $rootScope.goodsSearch_name = null;
    var tags = location.hash.split("tags=")[1] ? decodeURI(location.hash.split("tags=")[1]) : null;

    /*input placeholder*/
    $scope.placeholder = tags ? tags : '请输入商品关键词';

    // 数组去重
    function unitArr(arr) {
        var newArr = [];
        $(arr).each(function(index, item){
            if (newArr.indexOf(item) == -1) newArr.push(item);
        });

        return newArr;
    }

    /*热门标签数据*/
    app.myApp.ajax({
        url: '/goods/hotTags'
    }, function(res){
        if (!res.err) {
            $scope.data = res.data;
            $scope.$digest();
        } else $.toast(res.errMsg);
    })

    /*cookie读取搜索历史数据*/
    if ($.getCookie("search_history") == "null") {
        $.setCookie("search_history", "",-1);
    }
    $scope.history = decodeURI($.getCookie("search_history")).split(",").reverse();

    /*清空搜索历史*/
     $rootScope.clearHistory = false;
    $scope.clearHistory = function(){
        $.setCookie("search_history", "",-1);
        $rootScope.clearHistory = true;
        $scope.history = $.getCookie("search_history").split(",");
    }

    /*搜索*/
    var historyString = $.getCookie("search_history") ? ($.getCookie("search_history") + ",") : "";
    $scope.searchFn = function(tag) {
        $rootScope.data = null;
        if ($scope.inputTag || tag) {
            var tagString = tag ? tag : $scope.inputTag.replace(/ /g,',').replace(/,,/g,',').replace(/,,/g,',').replace(/,,/g,',');
            var unitTags =  encodeURI(unitArr(tagString.split(",")).join());
            var historyStr = unitArr((historyString + unitTags).split(",")).join();
            $scope.history.indexOf(unitTags) == -1 && $.setCookie("search_history", historyStr);
            tags = unitTags;    //带过去的tag
        } else {
            tags = tags ? tags.split(" ").join() : '';
            $.setCookie("search_history", tags);
        }

        location.href = ['#/goods', '#/community/beautyGoods', '#/goods/distribution'][$stateParams.type] + "?tags=" + tags;

    }

  }]);
});
