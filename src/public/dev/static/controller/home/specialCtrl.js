/**专题-美妆商城                            控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'         style.css
 * @param   {string} 'cs!smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 */

define(['app', 'angular', 'share', 'pager', 'lazyLoad', 'cs!style', 'cs!smCss', 'smJs', 'common/directive/header/header.js', 'cs!static/css/home/special'], function(app, angular, share) {
  /*定义 specialCtrl 控制器*/
  app.angular.controller('home/specialCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    /*设置标题*/
    app.myApp.settitle($rootScope, '专题-美妆商城');
    app.myApp.viewport("device");
    $.setCookie("goods_index_link", location.hash); // detail页面返回
    $scope.domain = $domain;
    $scope.headerForm = $.getParam("from") != 'app';
    $scope.headLeftFn = function(){
      location.href = "#/home";
    }

    /* 初始化数据 懒加载 */
    app.myApp.ajax({
      url: '/sale/specialDetail',
      data: {
        id: $stateParams.id // 专题id
      }
    }, function(res){
      if(!res.err){
        $scope.specialData = res.data;
        $scope.$digest();
        $(".lazy").lazyLoad();
      } else $.toast(res.errMsg);
    });

    // 获取配置中的分享url
    app.myApp.http($http, {
      url: '/system/config',
      method: 'GET',
      loading: false
    }, function(res){
      $scope.config = res;
    })

    /* 微信分享 */
    /* shareTitle  分享标题
     * shareDesc   分享内容
     * shareImgUrl 分享图片地址
     * shareLink   分享链接地址
     * callback.success分享成功之后回调
     */
    if ($stateParams.shareKey) {
      if (app.myApp.iniValue.isLogin()) { // 登录
          app.myApp.http($http, {
              url: '/member/share/visit',
              defaultResErr: false,
              data: {
                  shareKey: $stateParams.shareKey
              }
          }, function(){
            localStorage.removeItem('shareKey');
            localStorage.removeItem('shareKey_expire');
          })
      } else {  // 未登录 储存sharekey 7天后过期
        localStorage.shareKey = $stateParams.shareKey;
        localStorage.shareKey_expire = new Date(new Date().getTime() + 7 * 24 * 3600 * 1000).getTime();
      }
    }

    app.myApp.http($http, { // 获取分享KEY
      url: '/member/senior/share'
    }, function(res){
      $scope.shareKey = res.data;
    });

    $scope.shareFn = function(){
        var shareTitle = $scope.specialData.detail.title,
          shareDesc = $scope.specialData.detail.title,
          shareImgUrl = "http://img.beautysite.cn" + $scope.specialData.detail.image,
          shareLink = $scope.config.wapUrl.specialDetailShare + $stateParams.id + '?shareKey=' + $scope.shareKey,
          callback = {
            success: function(){
              $.toast("分享成功！");
              $(".wxfx").remove();
              app.myApp.recordShare($http, 0, -1);
            }
          };
        share.setContent(shareTitle, shareDesc, shareImgUrl, shareLink, callback);
        share.popupShare();
        // close modal
        $("body").delegate(".modal-overlay", "click", function(){
          $.closeModal();
        });
    };


  }]);
});