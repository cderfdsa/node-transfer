/**爆款购-美妆商城    						          控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'cs!sm-extendCss'      sm-extend.min.js
 * @param   {string} 'sm-extendJs'          sm-extend.min.js
 * @param   {string} 'pager'                pager.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 */

define(['app', 'angular', 'cs!style', 'cs!smCss', 'smJs', 'cs!sm-extendCss',
  'sm-extendJs', 'pager', 'lazyLoad', '/common/directive/footer/footer.js', 'cs!static/css/goods/index'], function(app, angular) {

  /*定义 indexCtrl 控制器*/
  app.angular.controller('goods/indexCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    /*设置标题*/
    app.myApp.settitle($rootScope, '爆款购-美妆商城');
    app.myApp.viewport("device");
    $scope.title = $rootScope.goodsSearch_name ? $rootScope.goodsSearch_name : "爆款购";

    /*初始化数据渲染*/
    // 设置 domain
    $scope.domain = $domain;

    /* 清空搜索历史 */

    // 每次加载添加多少条目
    $rootScope.page = $rootScope.page ? $rootScope.page : 0;
    $scope.searchNone = false;
    var tags = location.hash.split("tags=")[1] ? decodeURI(location.hash.split("tags=")[1]) : null;
    $scope.isShowTags = tags ? tags.split(',') : null;
    $scope.tags = tags;
    $rootScope.clearHistory && $.setCookie("search_history", tags);

    var cid = location.hash.split("cid=")[1] ? location.hash.split("cid=")[1] : null;
    $.setCookie("goods_index_link", location.hash); // detail页面返回

    /* 初始化数据渲染 分页 懒加载 */
    function addItems() {
      var data = {
        pageSize: 20,
        cid: cid,  // 搜索
        tags: $scope.tags // 搜索
      }

      $.pager({
        $scope: $scope,
        lazyEle: '.lazy',
        scrollEle: '.content',
        page: (cid || tags) ? 0 : $rootScope.page,
        pageSize: 20,
        url: '/goods/list',
        data: data,
        callBack: function(res) {
          if (!fromOther) {
            if ($scope.data) $scope.data = $scope.data.concat(res.data.rows);
            else $scope.data = res.data.rows;
            $rootScope.data = $scope.data;
            $scope.searchNone = !res.data.rows.length && (cid || tags) ? true : false;
          } else {
            fromOther = false;
            $scope.data = $rootScope.data;
            setTimeout(function() {
              $(".lazy").map(function() {
                $(this).prop("src", $(this).attr("lazySrc"));
              });
              $rootScope._position && $(".content").scrollTop($rootScope._position);
            }, 50);
          }
          $rootScope.page ++;  // 记录page
          $scope.$digest();
        }
      });
    }

    /* 进入其他页面返回时定位 */
    $(".content").scroll(function() { // 获取滚动位置
      $rootScope._position = $(".content").scrollTop();
    });
    if ($rootScope.data) {
      $rootScope.page --;
      var fromOther = true; // 其他页面返回时标记
    }
    addItems();

    // 购物车数量
    app.myApp.ajax({
      url: '/goods/cartNums'
    }, function(res) {
      if (!res.err) {
        $scope.count = res.data;
        $scope.$digest();
      } else {
        $.toast(res.errMsg);
      }
    });

    /*标签删除操作*/
    $scope.researchTag = function(tag) {
      if (tag) {
        $scope.isShowTags.splice($scope.isShowTags.indexOf(tag), 1);
        $scope.tags = $scope.isShowTags.join();
        location.href = !$scope.tags ? "#/goods" : "#/goods?tags=" + $scope.tags;
      } else {
        $scope.isShowTags = $scope.tags = null;
        location.href = "#/goods";
      }
      $scope.data = [];
      $rootScope.page = 0;
      $.setCookie("goods_index_link", location.hash); // detail页面返回
      addItems();
    }

    /*点击搜索框*/
    $scope.clickTag = function($event) {
      $rootScope.goodsSearch_name = null;
      if ($event.target.localName == "ul")
        location.href = "#/goods/search/0?tags=" + $scope.isShowTags.join(" ");
    }

    /*
     * 舒耐活动检测弹窗
     * 张凌<zhangl@meiwan.me> 2016-05-24
     */
    app.myApp.ajax({
      url: "/goods/rexonaCheck"
    }, function(res) {
       if (!res.err && res.data) {
        var RexonaModal =$.modal({
          title: '<img src="/static/img/goods/bg_RexonaModal.png">',
          extraClass: 'rexona_modal',
          buttons: [
            {
              text: '<img src="/static/img/task/sign_modal_close.png">'
            },
            {
              text: '免费领取',
              onClick: function() {
                // 舒耐活动领取
                app.myApp.ajax({
                    url: "/goods/rexonaReceive"
                  }, function(res) {
                    if (!res.err) {
                      $.toast("领取成功！请在我的红包中查看！");
                    } else $.toast(res.errMsg);
                });
              }
            },
          ]
        });
      }
    });

    /**
     * 随分销新增benner
     * 张凌<zhangl@meiwan.me> 2016-08-22
     */
    app.myApp.http($http, {
      url: '/banner/4/list',
      method: 'GET',
    }, function(res){
      $scope.banners = res.data;

      setTimeout(function(){
        $(".swiper-banner").swiper({
          autoplay: 5000, // delay between transitions
          autoplayDisableOnInteraction: false, // Set to false and autoplay will not be disabled after user interactions
          pagination: '.swiper-pagination' //分页 class
        });
      }, 50)
    })

  }]);
});
