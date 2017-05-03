/**指定商品-美妆商城    						        控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 */

define(['app', 'angular', 'share', 'cs!style', 'pager', 'lazyLoad', 'cs!smCss', 'smJs', 'common/directive/header/header.js', 'cs!static/css/goods/specify'], function(app, angular, share) {
  /*定义 specifyCtrl 控制器*/
  app.angular.controller('goods/specifyCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    /*设置标题*/
    app.myApp.settitle($rootScope, '指定商品-美妆商城');
    app.myApp.viewport("device");

    /* 初始化数据 分页 */
    $.pager({
      $scope: $scope,
      lazyEle: '.lazy',
      scrollEle: '.content',
      repeatEle: 'li',
      page: 0,
      url: '/sale/apointGoodsList'
    });

    /* 用户的邀请码 */
    app.myApp.ajax({
      url: '/sale/memberCode'
    }, function(res){
      if(!res.err){
        $scope.memberCode = res.data;
      } else $.toast(res.errMsg);
    });

    /* 扩大点选 */
    $scope.checkFn = function($index){
      $("[name='shareGoods']").prop("checked", false);
      $("[name='shareGoods']").eq($index).prop("checked", true);

      $scope.setContentFn();

    }


    /* 微信分享 */
    $scope.shareFn = function(){
      var checked_id = $("[name='shareGoods']:checked").val();

      if (checked_id) {
        share.popupShare();
        $scope.setContentFn();
      } else $.toast('亲，你还没有勾选商品哦~');

    };

    $scope.setContentFn = function(){
      var checked_index = $("[name='shareGoods']").index($("[name='shareGoods']:checked"));

      /* shareTitle  分享标题
       * shareDesc   分享内容
       * shareImgUrl 分享图片地址
       * shareLink   分享链接地址
       * callback.success分享成功之后回调
       */
      var shareTitle = $scope.data.rows[checked_index].title,
        shareDesc = $scope.data.rows[checked_index].subtitle,
        shareImgUrl = "http://img.beautysite.cn" + $scope.data.rows[checked_index].image,
        shareLink = $domain + "/site/apointGoodsBonus/id/" + $scope.data.rows[checked_index]._id + "/code/" + $scope.memberCode,
        callback = {
          success: function(){
            $.toast("分享成功！");
            $(".wxfx").remove();
            app.myApp.recordShare($http, 0, 5);
          }
        };
      share.setContent(shareTitle, shareDesc, shareImgUrl, shareLink, callback);
    };

  }]);
});