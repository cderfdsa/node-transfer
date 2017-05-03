/*向Zepto中添加 Cookie 方法*/
$.setCookie = function (name, value, iDay) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + iDay);
    document.cookie = name + '=' + value + ';expires=' + oDate;
}
$.getCookie = function (name) {
    var arr = document.cookie.split('; ');
    for (var i = arr.length - 1; i >= 0; i--) {
        var arr2 = arr[i].split('=');
        if (arr2[0] === name) {
            return arr2[1];
        }
    }
    return '';
}
$.removeCookie = function (name) {
    $.cookies.setCookie(name, 1, -1);
}

/*向Zepto增加 parseUrlQuery 方法*/
$.parseUrlQuery = function (url) {
    var query = {}, i, params, param;
    if (url && url.indexOf('?') >= 0) url = url.split('?')[1];
    else return query;
    params = url.split('&');
    for (i = 0; i < params.length; i++) {
        param = params[i].split('=');
        query[param[0]] = param[1];
    }
    return query;
};
$.getParam = function (param) { // 解析...?aaa=xxx&bb=xxx#/...
    var arr = location.search.split("&");
    if (!arr) return false;
    var val;
    $(arr).each(function(index, item){
        if (item.indexOf(param) > -1) {
            val = arr[index].split("=")[1];
            return false;
        }
    });
    return val || '';
}

/*版本号（与 manifest.php 版本号对应）*/
$.urlArgs = 'mw=2.0.10166' || new Date().getTime();

/*对按钮增加Active*/
$(document).on('touchstart','.button',function(){
    $(this).addClass('active');
});
$(document).on('touchend','.button',function(){
    $(this).removeClass('active');
});

/*不同环境url兼容*/
if (document.domain == 'wap.beautysite.cn') {       // 线上url
    $domain = 'http://wechat.beautysite.cn';
    $origin = true;
} else if (document.domain == 'wap.meiwan.me') {    // 测试
    $domain = 'http://wechat.meiwan.me';
    $origin = true;
} else {                                            // 本地
    $domain = 'http://luwechat.com';
    $origin = false;
}
$ajaxDomain = $domain + '/wap';

/*
 * 新增本地测试
 * 以 ?localtest 结尾的 url，默认使用本地 test 模拟 ajax
 */
if (/\?localtest$/g.test(location.hash)) $ajaxDomain = '/test';


/*requireJS 配置*/
require.config({
    'baseUrl' : './',               //目录路径
    'urlArgs' : $.urlArgs,          //附加在URL后面的额外的query参数
    'paths' : {                     //各类库路径
        // mod
        'lazyLoad'      : 'common/mod/lazyLoad/lazyLoad',
        'pager'         : 'common/mod/pager/pager',
        'share'         : 'common/mod/share/share',
        'style'         : 'common/mod/style/style',
        'wxImage'       : 'common/mod/wxImage/wxImage',
        'drag'          : 'common/mod/drag/drag',
        'address'       : 'common/mod/address/address',
        'fileUpload'    : 'common/mod/fileUpload/fileUpload',

        // lib
        'smCss'         : 'common/lib/sm/css/sm.min',
        'smJs'          : 'common/lib/sm/js/sm.min',
        'sm-extendCss'  : 'common/lib/sm/css/sm-extend.min',
        'sm-extendJs'   : 'common/lib/sm/js/sm-extend.min',
        'animateCss'    : 'common/lib/animate/animate.min',
        'layerJs'       : 'common/lib/layer/layer.m',
        'layerCss'      : 'common/lib/layer/layer',
        'wxjs'          : 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
        'chart'         : 'common/lib/chart/Chart.bundle.min',
        'touch'         : 'common/lib/zepto/touch.min',
        'moment'        : 'common/lib/moment/moment',
        'fx'            : 'common/lib/zepto/fx',
        'socket'        : 'https://cdn.socket.io/socket.io-1.4.5',

        'angular'       : 'common/lib/angular/angular.min',
        'ngUirouter'    : 'common/lib/angular/angular-ui-router.min',
        'lodash'        : 'common/lib/lodash/lodash.min',
        'iscroll'       : 'common/lib/iscroll/iscroll.min',
        'jQuery'        : 'common/lib/jquery/jquery-1.10.2.min',
        'bootstrapCss'  : 'common/lib/bootstrap/css/bootstrap.min',
        'ioniconsCss'   : 'common/lib/css/ionicons/ionicons.min',
        'requireCss'    : 'common/lib/require/require.css.min',
        'smextendCss'   : 'common/lib/sm/sm-extend.min',
        'smextendJs'    : 'common/lib/sm/sm-extend.min',
        'app'           : 'app',
        'ngAsync'       : 'common/lib/angular/angular-async-loader.min',
        'ngAnimate'     : 'common/lib/angular/angular-animate.min',
        'ngSanitize'    : 'common/lib/angular/angular-sanitize.min',
        'md5'           : 'common/lib/coded/md5.min',
        'sha1'          : 'common/lib/coded/sha1.min',
        'swiperCss'     : 'common/lib/swiper/swiper.min',
        'swiperJs'      : 'common/lib/swiper/swiper.min',

        'countdownJs'   : 'common/lib/countdown/countdown',
        'scrollDeleteJs': 'common/lib/scrollDelete/scrollDelete',
        'pingpp'        : 'http://cdn.beautysite.cn/static/wechat/js/pingpp',
        'cnzz'          : 'https://s95.cnzz.com/z_stat.php?id=1260108996&web_id=1260108996',
        'BMap'          : 'http://api.map.baidu.com/api?v=2.0&ak=7LwHfUlKfxHsM182rox5VHsX73fGMBXN'

        // directive

    },
    'map' : {
        '*': {'cs': 'common/lib/require/require.css.min'}
    },
    'shim': {
        'angular': {'exports': 'angular'},
        'ngUirouter':{'deps': ['angular']},
        'ngAnimate':{'deps': ['angular']},
        'ngSanitize':{ 'deps': ['angular']},
        'lodash': {'exports': "lodash"},
        'iscroll': {'exports': "iscroll"},
        'md5': {'exports': 'md5'},
        'sha1': {'exports': 'sha1'},
        'jQuery': {'exports': 'jQuery'},
        'wxjs': {'exports': 'wxjs'}
    }
});

/**config JS  依赖的JS CSS
 * @param {string} 'angular'                 angular.min.js
 * @param {string} 'routes'                  routes.js
 * @param {string} 'js/controllers/mainCtrl' mainCtrl.js
 */
define(['angular','routes','static/controller/mainCtrl'], function (angular) {
    /*angular JS加载完 页面应用才会开始运行*/
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['mwapp']); /*手动启动 angular hwzgapp模块加载*/
        $('html').addClass('ng-app');
        $('.views').addClass('views-in');
    });
})
