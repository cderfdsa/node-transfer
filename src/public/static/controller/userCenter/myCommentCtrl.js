/**我的评论-美妆商城    						        控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 * @param   {string} 'moment'               moment.js
 */

define(['app', 'angular', 'moment', 'cs!smCss', 'smJs', 'pager', 'lazyLoad', '/common/directive/header/header.js','cs!static/css/userCenter/myComment'], function(app, angular, moment) {

  /*定义 myCommentCtrl 控制器*/
  app.angular.controller('userCenter/myCommentCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    /*设置标题*/
    app.myApp.settitle($rootScope, '我的评论-美妆商城');

    // 设置 device
    app.myApp.viewport("device");

    //初始化数据渲染
    $.pager({
      $scope: $scope,
      lazyEle: '.lazy',
      scrollEle: '.content',
      repeatEle: '.item',
      page: 0,
      url: '/order/commentList',
      callBack: function(res) {

        $(res.data.rows).each(function(index, item ){
          item.updatedAt = moment(item.updatedAt).format('YYYY-MM-DD');
        });

        if ($scope.data) $scope.data.rows = $scope.data.rows.concat(res.data.rows);
        else $scope.data = res.data;
        $scope.$digest();
      }
    });

  }]);
});