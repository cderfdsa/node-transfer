/**首页-美妆商城                              控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'         	style.css
 * @param   {string} 'cs!smCss'         	sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'cs!sm-extendCss'      sm-extend.min.css
 * @param   {string} 'sm-extendJs'          sm-extend.min.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 */

define([
    'app',
    'angular',
    'lazyLoad',
    'cs!style',
    'cs!smCss',
    'smJs',
    'cs!sm-extendCss',
    'sm-extendJs',
    '/common/directive/header/header.js',
    '/common/directive/footer/footer.js',
    'cs!static/css/home/index'
], function(app, angular) {

/*定义 indexCtrl 控制器*/
app.angular.controller('home/indexCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$http',
    function($rootScope, $scope, $state, $stateParams, $http) {
    $.extend($scope, {
        init: function(){
            this.staticScope();
            this.initAjax();
            this.titleScroll();
        },

        /* 初始化静态 $scope */
        staticScope: function(){
            app.myApp.settitle($rootScope, '美妆商城'); // 设置标题
            app.myApp.viewport("device"); // viewport
            $scope.domain = $domain;  // 设置domain
            $.setCookie("goods_index_link", location.hash); // detail页面返回
        },

        /* 初始化动态数据 */
        initAjax: function(){
            var self = this;

            // 首页各种banner
            app.myApp.http($http, {
              url: '/banner/home/list',
              method: 'GET'
            }, function(res) {
                // 头部 banner
                $(res.data.banner).each(function(index, item){ // 本地活动静态模板页地址替换为angular地址
                  if (item.url)
                    item.url = item.url.replace(/.*\/(activity)\/include\/(.+)\.html/g, "#/$1/$2");
                });

                $(res.data.ad).each(function(index, item){ // 广告区地址去掉?from=app
                  if (item.url)
                    item.url = item.url.replace(/\?from\=app/g, '');
                });

                $scope.homeBanners = res.data;

                // 回调banner图片滑动插件
                setTimeout(function(){
                    self.initSwiper();
                })
            });

            // 社区热门
            app.myApp.http($http, {
              url: '/community/card/excellent/list',
              method: 'GET'
            }, function(res) {
                $scope.excellentLists = res.data;

                setTimeout(function(){
                    self.goodsSwiper(".swiper-hotCommunity", 2.8);
                });
            });

            // 特卖商品列表(取特卖第一个)
            app.myApp.http($http, {
                url: '/member/product/promotions',
                method: 'GET',
                data: {
                    page: 0,
                    pageSize: 1
                }
            }, function(res){
                $scope.promotion = res.data.rows[0];
                setTimeout(function(){
                    $scope.promotion && self.countDown($scope.promotion);
                });
            });

            // 商品专题列表
            app.myApp.http($http, {
                url: '/special/indexList',
                method: 'GET'
            }, function(res){
                $scope.goodSpecials = res.data;
                setTimeout(function(){
                    self.goodsSwiper(".swiper-special", 3.5);
                });
            });

            // 爆款推荐
            app.myApp.http($http, {
              url: '/product/recommand/list',
              method: 'GET'
            }, function(res) {
                $scope.recommendGoods = res.data;
                setTimeout(function(){
                    $('.lazy').lazyLoad();
                })
            });

            if (app.myApp.iniValue.isLogin()) {
                // 获取用户信息
                app.myApp.http($http, {
                    url: '/member/detail',
                    data: {
                        v: 1.0
                    },
                    method: 'GET',
                    defaultResErr: false,
                    loading: false
                }, function(res){
                    if (!res.err) {
                        // 用于头部去消息链接
                        $scope.userInfo = res.data;

                        // 诸葛io(识别用户)
                        // var birthday = new Date(res.data.birthday);
                        // zhuge.identify(res.data.id, {
                        //     avatar: res.data.headImg,    // 用户分析界面的头像
                        //     name: res.data.nickName,     // 用户名
                        //     gender: ['女', '男', '女'][res.data.sex],  // 用户性别（男，女）
                        //     birthday: birthday.getFullYear() + '/'
                        //         + ((birthday.getMonth()+1).toString().length < 2 ? '0' : '') + (birthday.getMonth()+1) + '/'
                        //         + (birthday.getDate().toString().length < 2 ? '0' : '') + birthday.getDate(), // 生日（yyyy/MM/dd）
                        //     location: res.data.city      // 地域（如：北京）
                        // });
                    }
                });

                //用户未读消息统计
                app.myApp.http($http, {
                    url: '/member/community/notify/unread',
                    method: 'GET'
                }, function(res) {
                    if (res.data) {
                        $scope.msg = res.data > 9 ? 9 + '+' : res.data;
                        $(".home_index_header .icon.pull-right").append('<span>' + $scope.msg + '</span>');
                    }
                });
            }

            // 兑吧首页链接
            app.myApp.http($http, {
                url: '/member/duiba/url',
                method: 'GET',
                loading: false
            }, function(res){
                $scope.duibaUri = res.data;
            });
        },

        /* banner 滑动插件初始化 */
        initSwiper: function(){
            $(".swiper-banner").swiper({
            	autoplay: 4000,  // delay between transitions
                autoplayDisableOnInteraction: false,  // Set to false and autoplay will not be disabled after user interactions
                pagination: '.swiper-pagination',  //分页 class
                onInit: function(){ // 统一banner image高度
                    $(".swiper-banner .swiper-wrapper img")
                        .last()
                        .on("load", function(){
                        $(".swiper-banner .swiper-wrapper img").height(
                            $(".swiper-banner .swiper-wrapper").height()
                        );
                    });
                }
            });
        },

        /* 社区热门、商品专题列表 滑动插件初始化 */
        goodsSwiper: function(className, num){
            $(className).swiper({
                slidesPerView: num    //视口个数
            });
        },

        /*频道位跳转(每日签到、邀请好友限制登录)*/
        channelJump: function(uri){
            var limitLoginIndex = ['/member/sign', '/task/invite', '/goods/duiba', '/community/home'].indexOf(uri)
            if (limitLoginIndex == 0 || limitLoginIndex == 1) {
                if (app.myApp.ifLogin(['#/task/sign', '#/userCenter/ambCenter/invite/1'][limitLoginIndex], location.hash) == false)
                    return;
            }
            location.href = ['#/task/sign', '#/userCenter/ambCenter/invite/1', $scope.duibaUri, '#/community/list/0'][limitLoginIndex];
        },

        /* 特卖倒计时 */
        countDown: function(date){
            function to2(val){    // 保持两位数字
              if (val < 10) return '0' + val;
              else return val;
            }

            var countInterval = setInterval(function(){
                var timer = date.endTime - new Date().getTime();
                date.hh = timer > 0 ? to2(parseInt(timer/(60*60*1000))) : '00';
                date.mm = timer > 0 ? to2(parseInt(timer%(60*60*1000)/(60*1000))) : '00';
                date.ss = timer > 0 ? to2(parseInt(timer%(60*60*1000)%(60*1000)/1000)) : '00';
                $scope.$digest();

                if (timer <= 1000) clearInterval(countInterval);
            }, 1000);
        },

        /* 标题滚动渐显 */
        titleScroll: function(){
            var opacity = 0;
            $(".content").scroll(function(){
              opacity = $(this).scrollTop()/176;
              if (opacity > 1) opacity = 1;
              $("header h1.title").css("opacity", opacity);
            });
        },

        /* 头部链接去消息 */
        headRightFn: function(){
            // 未登录跳转去登陆
            if (app.myApp.ifLogin('#/home') == false) return;
            location.hash = '#/userCenter/message/' + $scope.userInfo.id;
        }

    });

    $scope.init();
  }]);
});
