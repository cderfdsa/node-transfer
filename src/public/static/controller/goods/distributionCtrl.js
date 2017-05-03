/**分销-美妆商城    			               控制器 依赖JS CSS
 * @param   {string} 'app'                 	app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'cs!sm-extendCss'      sm-extend.min.css
 * @param   {string} 'sm-extendJs'          sm-extend.min.js
 * @param   {string} 'pager'                pager.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 * @param   {string} 'share'                sharejs
 */

define([
	'app',
	'angular',
    'share',
	'cs!style',
	'cs!smCss',
	'smJs',
    'cs!sm-extendCss',
    'sm-extendJs',
    'pager',
    'lazyLoad',
	'/common/directive/header/header.js',
    '/common/directive/tab/tab.js',
	'cs!static/css/goods/distribution'
], function(app, angular, share) {

	/* define goods/distributionCtrl controller */
	app.angular.controller('goods/distributionCtrl', [
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
				this.scrollTab();
			},

			/* initialize static $scope */
			staticScope: function() {
				app.myApp.settitle($rootScope, '分享赚钱-美妆商城');  // set title
				app.myApp.viewport("device");   // set viewport

                // 搜索
                $scope.tags = location.hash.split("tags=")[1] ?
                  decodeURIComponent(location.hash.split("tags=")[1].split("&")[0]).split(',') : [];
                $rootScope.clearHistory && $.setCookie("search_history", $scope.tags);
			},

            /* get initialize data */
			initAjax: function() {
                // 商品专题列表
                app.myApp.http($http, {
                    url: '/special/indexList',
                    method: 'GET',
                    data: {
                        type: 1 // 1是分销内页
                    }
                }, function(res){
                    $scope.goodSpecials = res.data;
                    setTimeout(function(){
                        $scope.goodsSwiper(".swiper-special", 3.5);
                    });
                });

                // slider banner
                app.myApp.http($http, {
                    url: '/banner/2/list',
                    method: 'GET'
                }, function(res){
                    $scope.banners = res.data;
                    setTimeout(function(){
                        $scope.goodsSwiper(".swiper-banner", 1);
                    });
                });

                // 用户信息
                app.myApp.http($http, {
                    url: '/member/detail',
                    data: {
                        v: 1.0
                    },
                    method: 'GET',
                    loading: false
                }, function(res){
                    $scope.userInfo = res.data;
                });

                // 获取分享KEY
                app.myApp.http($http, {
                    url: '/member/senior/share'
                }, function(res){
                    $scope.shareKey = res.data;
                });

                if (!$scope.tags.length) localStorage.distribution_sort = 1;
                $scope.filterGoods(localStorage.distribution_sort || 1, $scope.tags);
			},

            /**
             * page=页数
             * pageSize=每页条数
             * category=分类ID
             * tags=['润肤','保湿']
             * sort=0,1(选填 0:最新 1:销量 2:返比由高到低 3:返现由高到低)
             * type=默认购买, 1:分销商品
             */
            filterGoods: function(sort, tags){
                localStorage.distribution_sort = $scope.sort = sort;
                $('.loadAll, .swipLoad').remove();

                // 商品列表
                $.pager({
                	$scope: $scope,
                	scrollEle: '.content',
                    lazyEle: '.lazy',
                	url: '/product/list',
                	http: $http,
                	method: 'POST',
                	data: $.extend({
                        sort: sort,
                        type: 1
                    }, tags ? {tags : tags} : {})
              	});
            },

            /* 社区热门、商品专题列表 滑动插件初始化 */
            goodsSwiper: function(className, num){
                $(className).swiper({
                    slidesPerView: num    //视口个数
                });
            },

            /* tab 切换回调 */
            tabMenuFn: function($index) {
                $scope.tabActive = $index;
                $scope.filterGoods($index + 1);
            },

			/* tab 滚动效果 */
			scrollTab: function(){
				$('.content').on('scroll', function(){
                    if ($scope.tags.length) return;

					if ($('.goodsList').offset().top <= 94) {
						$('.tab_box').hasClass('fix') || $('.tab_box, .goodsList').addClass('fix');
					} else {
						$('.tab_box').hasClass('fix') && $('.tab_box, .goodsList').removeClass('fix');
					}
				})
			},

            /* 分享 */
            share: function($index){
                var shareTitle = $scope.userInfo.nickName + '给你分享了' + $scope.data.rows[$index].name + '，赶紧来抢',
                    shareDesc = '美妆商城，室友偷偷变美的秘密',
                    shareImgUrl = 'http://img.beautysite.cn' + $scope.data.rows[$index].images,
                    shareLink = $domain+'/goods/detail/' + $scope.data.rows[$index]._id + '?shareKey=' + $scope.shareKey,
                    callback = {
                        success: function() {
                            $.toast("分享成功！");
                            $(".wxfx").remove();
                            app.myApp.recordShare($http, 0, -1);
                        }
                    };

                share.setContent(shareTitle, shareDesc, shareImgUrl, shareLink, callback);
                share.popupShare();

                $("body").delegate(".modal-overlay", "click", function() { // close tip modal
                    $.closeModal();
                });
            },

            // 去搜索页
            headRightFn: function(){
                location.hash = '#/goods/search/2';
            },

            /*点击搜索框*/
            clickTag : function($event) {
                $rootScope.goodsSearch_name = null;
                if ($event.target.localName == "ul")
                    location.href = "#/goods/search/2?tags=" + $scope.tags.join(" ");
            },

            /*标签删除操作*/
            researchTag :function(tag) {
                if (tag) $scope.tags.splice($scope.tags.indexOf(tag), 1);
                else $scope.tags = [];

                location.href = !$scope.tags.length ? "#/goods/distribution" : "#/goods/distribution?tags=" + $scope.tags.join();
                $scope.initAjax();
            }
		});

		$scope.init();
	}]);
});
