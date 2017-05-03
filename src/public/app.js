/**应用主JS  公共JS APP.JS 依赖下面几个JS
 * @param   {string} 'angular'    angular.min.js
 * @param   {string} 'ngAsync'    angular-async-loader.min.js
 * @param   {string} 'ngUirouter' angular-ui-router.min.js
 * @param   {string} 'ngSanitize' angular-sanitize.min.js
 */
define([
    'angular',
    'ngAsync',
    'ngUirouter',
    'ngSanitize'
], function(angular, asyncLoader) {

    /*定义 myApp 对象 用于应用全局*/
    var myApp = {};

    /* 改变 viewport, 兼容 sui */
    myApp.viewport = function(type) {
        var content = type == "device" ? "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" : "target-densitydpi=device-dpi, width=640px, user-scalable=no";
        $("[name='viewport']").prop("content", content);
    }

    /*cookie 临时信息*/
    myApp.cookie = function() {
        var local = {};
        if (typeof window.localStorage !== 'undefined') {
            local = window.localStorage;
        }
        return local;
    }();

    /*localStorage 持久化的本地存储*/
    myApp.localStorage = function() {
        var local = {};
        if (typeof window.localStorage !== 'undefined') {
            local = window.localStorage;
        }
        return local;
    }();

    /*向myApp 增加query属性*/
    myApp.query = $.parseUrlQuery(location.href.split('#')[1]);

    /*初始数据*/
    myApp.iniValue = {
        'appData': JSON.parse(myApp.localStorage.getItem('appData')) || {}, //App原生登录存全局数据
        'key': myApp.query.key || myApp.localStorage.getItem('key') || '', //KEY
        'cityId': myApp.query.cityId || (myApp.localStorage.getItem('cityId') == 'null' ? '' : myApp.localStorage.getItem('cityId')) || 52, //城市ID
        'controller': './static/controller/', //控制器目录路径
        'service': './common/service/', //服务目录路径
        'template': './page/', //模板目录路径
        'directive': './common/directive/', //指令目录路径
        'version': '1.9.5', //版本号
        // 'fromhw'        : 'web',                                                                  //来自WEB  还有IOS 安卓
        'isFirstLoading': function() { //是否第一次进入页面
            var status = !$.getCookie("isFirstLoading");
            status && $.setCookie("isFirstLoading", "no");
            return status;
        }(),
        'isLogin': function(){  //是否登录
            return !!$.getCookie("user_login_token") && new Date().getTime() < $.getCookie("user_login_token_expire");
        },
        'isApp': false, //载体是否App
        'isWeiXin': navigator.userAgent.toLowerCase().indexOf('micromessenger/') > -1,
        'isAndroid': navigator.userAgent.toLowerCase().indexOf('android') > -1 || navigator.userAgent.toLowerCase().indexOf('linux') > -1,
        'isIos': navigator.userAgent.toLowerCase().indexOf('iphone') > -1,
        'hostname': function() {
            var lchref = window.location.href;
            if (lchref.indexOf('/src/') > -1) {
                return lchref.split('/src/')[0] + '/src/';
            } else if (lchref.indexOf('/dist/') > -1) {
                return lchref.split('/dist/')[0] + '/dist/';
            } else {
                return window.location.hostname;
            }
        }()
    };

    /*设置标题 及其它浏览器 微信 Webview Title更新*/
    myApp.settitle = function($rootScope, t, url) {
        $rootScope.init.headinfo.title = t;
        if (typeof window.jsObj !== 'undefined') {
            /*传值给原生APP 设置标题*/
            window.jsObj.jump('title', t);
            /*url 传值给原生APP 返回上一页地址*/
            var geturl = url;
            if (url) {
                geturl = myApp.iniValue.hostname + '#/' + url
            };
            window.jsObj.jump('backUrl', (geturl || 'pop'));
        }
        var $body = $('body');
        document.title = t;
        // var $iframe = $('<iframe src="./img/icon/icon-57.png"></iframe>').on('load', function() {
        //     setTimeout(function() {
        //         $iframe.off('load').remove()
        //     }, 50)
        // }).appendTo($body);
    };

    /*传APP 分享 数据*/
    myApp.toAppShareData = function(data) {
        if (typeof window.jsObj !== 'undefined') {
            // window.jsObj.jump('shareData',JSON.stringify(data));
        }
    };

    /*uuid加密*/
    myApp.generateGUID = function() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    };

    /*AJAX loading方法*/
    myApp.ajaxLoad = {
        show: function() {
            $('.loading').show();
        },
        hide: function() {
            $('.loading').hide();
        }
    };

    /*设备信息*/
    myApp.device = $.device;

    /*浏览器信息*/
    myApp.naviuser = navigator.userAgent.toLowerCase();

    /*对象合并方法*/
    myApp.extend = function(o, n, override) {
        for (var p in n)
            if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override)) o[p] = n[p];
    };

    /*AJAX*/
    myApp.ajax = function(parame, successFn, errorFn) {
        this.parame = parame;
        this.parameData = parame.data || {};
        var parames = {
            'loading': true, //是否需要loading
            'timeout': 100000, //AJAX 100秒超时
            'async': true, //默认异步请求
            'type': 'POST', //请求方式
            'url': '/', //请求地址
            'data': {
              backUrl: location.href,    // wap当前页url
              user_login_token: $.getCookie("user_login_token")
            },
            'dataType': 'json', //默认以JSON解析
            processData: true,
            contentType: 'application/x-www-form-urlencoded',
            withCredentials: $origin, //获取头信息（cookie）
            crossDomain: $origin //允许跨域
        };
        myApp.extend(this.parame, parames);
        myApp.extend(this.parameData, parames.data);
        parames = this.parame;
        $.ajax({
            'type': parames.type,
            'url': $ajaxDomain + parames.url + ($ajaxDomain == '/test' ? '.json' : ''),
            'data': parames.data || {},
            'dataType': parames.dataType,
            'timeout': parames.timeout,
            processData: parames.processData,
            contentType: parames.contentType,
            xhrFields: {
                withCredentials: parames.withCredentials //获取头信息（cookie）
            },
            crossDomain: parames.crossDomain, //允许跨域
            'beforeSend': function(xhr, settings) { //请求发出前
                if (parames.loading) {
                    myApp.ajaxLoad.show()
                };
            },
            'success': function(data, status, xhr) { //请求成功返回
                if (data.err == -1) {   //未登录，跳转登录
                    if (myApp.ifLogin(location.hash) == false) return;
                }
                successFn && successFn(data);
            },
            'error': function(xhr, type) { //请求错误
                errorFn ? errorFn(xhr) : $.toast ? $.toast('未知错误') : '';
            },
            'complete': function(xhr, status) { //请求错误或成功
                myApp.ajaxLoad.hide()
            }
        })
    };

    /**
     * angular $http （不跨域情况下）
     * @param  {[type]} $http      [description]    angular controller $http
     * @param  {[type]} parames    [description]    ajax parames
     * @param  {[type]} successFn  [description]    success callback
     * @param  {[type]} errorFn    [description]    error callback
     * @param  {[type]} toastClass [description]    define sui toast class
     * @return {[object]} res      [description]    response
     */
    myApp.http = function($http, parames, successFn, errorFn, toastClass) {
        var method = (parames.method || 'POST').toUpperCase(), // request type
            relativePath = /\?localtest$/g.test(location.hash) ? '/test' : '/api',
            data = $.extend({    // 传参 token
                token: $.getCookie("user_login_token")
            }, parames.data || {});

        if (parames.loading != false) {  // 显示请求图标
            myApp.ajaxLoad.show();
        };

        $http({
            url: relativePath + parames.url + (relativePath == '/test' ? '.json' : ''),
            method: method,
            data: method != 'GET' && data || {},
            params: method == 'GET' && data || {},
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        }).success(function(res, header, config, status){   //响应成功
            myApp.ajaxLoad.hide();

            if (parames.defaultResErr == false) {           // 自定义相应模板
                successFn && successFn(res, header, config, status);
                return;
            }

            if (!res.err) {                                 // 默认相应模板
                successFn && successFn(res, header, config, status);
            } else $.toast(res.errMsg, 2000, toastClass || '');
        }).error(function(res, header, config, status){     //响应失败
            if (res) {
                errorFn ? errorFn(res, header, config, status) : $.toast ? $.toast('未知错误') : '';
            }

            myApp.ajaxLoad.hide();
        });
    };

    /*取值 区间值*/
    myApp.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * 未登录跳转去登录页
     * @param  {[type]} succHash [description] 登陆成功跳转 hash
     * @param  {[type]} backHash [description] 登录页直接返回 hash
     */
    myApp.ifLogin = function(succHash, backHash) {
        var localhash = succHash || location.hash;
        var signInBackHash = backHash || location.hash;
        if (localhash.indexOf('#/userCenter/login/signIn/1') > -1) return;

        if (!myApp.iniValue.isLogin()) {
            localStorage.loginBackHash = localhash;
            localStorage.signInBackHash = signInBackHash;
            location.hash = '#/userCenter/login/signIn/1';
            return false;
        }
    };

    /* 第三方登录 QQ、Sina Weibo、weixin
     * type: qq/weibo/weixin
     */
    myApp.thirdLogin = function(type, hash){
        var backUrl = (hash || localStorage.loginBackHash || '').replace('#', '') || '/home';
        localStorage.removeItem("loginBackHash");

        if (myApp.iniValue.isLogin()) // 已登录跳转回原页面
            location.hash = backUrl;

        $.setCookie('thirdLoginBind', '');  // 去除绑定标记
        location.href = '/auth/' + type + '?backUrl=' + backUrl;
    },

    /* 第三方绑定|解绑 QQ、Sina Weibo
     * type: qq/weibo
     */
    myApp.thirdBind = function(type){
        if (myApp.iniValue.isWeiXin) return;    //微信中直接退出

        var backUrl = (localStorage.loginBackHash || location.hash).replace('#', '');

        if (myApp.ifLogin() == false) return;    // 未登录跳转去登陆

        $.setCookie('thirdLoginBind', type);
        localStorage.removeItem("loginBackHash");

        location.href = '/auth/' + type + '?backUrl=' + backUrl;
    },

    /*退出登录*/
    myApp.loginOut = function() {
        if (myApp.iniValue.isLogin()) { // 有登录才退出
            // 删除本域名下的cookie
            $.setCookie("user_login_token", '', -1);
            $.setCookie("user_login_token_expire", '', -1);

            // 删除后端种下的cookie
            location.href = '/logout';
        }
    };

    /**
     * 分享统计
     * @param  {[type]} type   [description] 统计类型:-1其他 0分享 1访问 2下载贡献
     * @param  {[type]} source [description] 分享来源:-1其他 0商品详情 1帖子详情 2话题分享 3红包分享 4邀请返利 5指定商品分享
     */
    myApp.recordShare = function($http, type, source){
        myApp.http($http, {
            url: '/member/share/record/save',
            data: $.extend({
                type: type,
                source: source
            }, type == 1 ? {url: location.href} : {})
        });
    }

    /**
     * CNZZ 监控
     * @param  {[type]} action [description]
     * how to use: app.myApp.cnzz('note');
     */
    myApp.cnzz = function(action) {
        // cnzz 事件配置
        var obj = {
            cartAdd: {label: '添加购物车'},
            cartBuy: {label: '购物车结算'},
            orderCreate: {label: '下单'},
            orderPay: {label: ' 订单支付'},

            cardBonus: {label: '领取拔草红包'},
            cardShare: {label: '帖子分享'},
            comment: {label: '帖子评论'},
            follow: {label: '关注'},
            login: {label: '登陆'},
            register: {label: ' 注册'},
            test: {label: '测试事件'},
            thirdLogin: {label: '第三方登陆'},
            wow: {label: 'wow'},
            note: {label: '化妆笔记'},
            potu: {label: ' po图'}
        };

        if (myApp.naviuser.indexOf('baiduboxapp/') < 0) { //手机百度不支持CNZZ
            require(['cnzz'], function(){
                _czc.push(['_trackEvent', '美妆', action, obj[action].label, 1, '']);
            });
        }
    };

    /* 打开原生APP */
    myApp.openApp = function(path, elseFn){
        var appUrl;
        if (myApp.iniValue.isAndroid) appUrl = 'meiwan://' + (path || '');
        if (myApp.iniValue.isIos) appUrl = 'beautysite://' + (path || '');

        if (appUrl)
            $('<iframe src="' + appUrl + '" style="display: none;" id="openAppFrame"></iframe>').appendTo("body");

        setTimeout(function(){
            $("#openAppFrame").remove();
            elseFn && elseFn();
        }, 500);
    };

    //加载微信JS
    if (myApp.naviuser.indexOf('micromessenger/') > 0) {
        require(['wxjs']);
    }

    /*兼容安卓版 微信 某些机型键盘 挂出 键盘挂不起 BUG*/
    myApp.androidKeyBug = function() {
        if (myApp.device.android && myApp.naviuser.indexOf('micromessenger/') > -1) {
            var heightAry = [];
            setInterval(function() {
                var windowH = parseInt(window.innerHeight);
                if (heightAry.indexOf(windowH) < 0) {
                    heightAry.push(windowH)
                }
                if (heightAry[1]) {
                    var hc = parseInt(heightAry[0]) - parseInt(heightAry[1]);
                    if (hc > 0) {
                        heightAry = [];
                    }
                    if (hc < 0) {
                        heightAry = [];
                        $('input').blur();
                    }
                }
            }, 100)
        };
    };

    var app = angular.module('mwapp', ['ui.router', 'ngSanitize']);
    asyncLoader.configure(app);

    /*向外暴露 app myapp 对象*/
    return {
        'angular': app,
        'myApp': myApp
    };
});
