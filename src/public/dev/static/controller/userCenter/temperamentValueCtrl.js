/**气质值-美妆商城                        控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 * @param   {string} 'moment'               moment.js
 */

define(['app', 'angular','moment','cs!smCss', 'smJs', 'pager', 'lazyLoad' ,'/common/directive/header/header.js', 'cs!static/css/userCenter/temperamentValue'], function(app, angular,moment) {

  /*定义 incomeDetailCtrl 控制器*/
  app.angular.controller('userCenter/temperamentValueCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    /*设置标题*/
    app.myApp.settitle($rootScope, '气质值-美妆商城');
    $scope.title = '气质值';
    app.myApp.viewport("device");
    $scope.domain = $domain;

    /*初始化数据渲染*/
    //用户信息
    app.myApp.ajax({
        url:'/account/userInfo'
    },function(res){
        if(!res.err){
            $scope.face = res.data.user;
            $scope.$digest();
        }else $.toast(res.errMsg)
    })
    /*分页数据*/
    $.pager({
        $scope: $scope,
        lazyEle: '.lazy',
        scrollEle: '.content',
        page: 0,
        pageSize:20,
        url: '/account/userExpList',
        data:{
            page:0,
            pageSize:20
        },
        callBack: function(res) {
            $(res.data.rows).each(function(index, item) {
                item.createdAt = moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss');
            });
            if ($scope.data) $scope.data.rows =$scope.data.rows.concat(res.data.rows);
            else $scope.data = res.data;
            $scope.$digest();
        }
    });

    }]);
});
