/**美物商品-美妆商城                          控制器 依赖JS CSS
 * @param   {string} 'app'                    app.js
 * @param   {string} 'angular'                angular.min.js
 * @param   {string} 'cs!style'               style.css
 * @param   {string} 'cs!smCss'               sm.min.css
 * @param   {string} 'smJs'                   sm.min.js
 * @param   {string} 'pager'                  pager.js
 * @param   {string} 'lazyLoad'               lazyLoad.js
 * @param   {string} 'moment'                 moment.js
 */

define(['app', 'angular', 'cs!style', 'cs!smCss', 'smJs', 'pager', 'lazyLoad', '/common/directive/header/header.js', 'cs!static/css/community/beautyGoods'], function(app, angular) {

    /*定义 wowCtrl 控制器*/
    app.angular.controller('community/beautyGoodsCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
        $.extend($scope, {
            init: function() {
                this.staticScope();
                this.initAjax();
            },

            /* 初始化静态 $scope */
            staticScope: function() {
                app.myApp.settitle($rootScope, '美物商品-美妆商城'); // 设置 title
                app.myApp.viewport("device"); // 设置viewport

                $scope.tags = location.hash.split("tags=")[1] ?
                  decodeURIComponent(location.hash.split("tags=")[1].split("&")[0]).split(',') : [];

                $rootScope.clearHistory && $.setCookie("search_history", $scope.tags);
            },

            /* 初始化动态数据 */
            initAjax: function() {
              $.pager({
                $scope: $scope,
                lazyEle: '.lazy',
                scrollEle: '.content',
                url: '/goods/list',
                data: {
                    tags: $scope.tags ? $scope.tags.join() : '' // 搜索
                }
              });
            },

            /*点击搜索框*/
            clickTag : function($event) {
                $rootScope.goodsSearch_name = null;
                if ($event.target.localName == "ul")
                  location.href = "#/goods/search/1?tags=" + $scope.tags.join(" ");
            },

            /*标签删除操作*/
            researchTag :function(tag) {
                if (tag) $scope.tags.splice($scope.tags.indexOf(tag), 1);
                else $scope.tags = [];
                location.href = !$scope.tags.length ? "#/community/beautyGoods" : "#/community/beautyGoods?tags=" + $scope.tags.join();

                $scope.initAjax();
            },

            /* 带商品信息到代言笔记 */
            toNote: function($index) {
              var item = $scope.data.rows[$index];
              $rootScope.community_noteGoods = {
                _id: item._id,
                images: item.images,
                name: item.name,
                introduction: item.introduction,
                price: item.price,
                marketPrice: item.marketPrice,
                discount: item.discount
              }
              location.href = '#/community/note';
            }
        });

        $scope.init();

    }]);
});
