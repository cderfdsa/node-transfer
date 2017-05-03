/**添加评论-美妆商城    						    控制器 依赖JS CSS
 * @param   {string} 'app'              app.js
 * @param   {string} 'angular'          angular.min.js
 * @param   {string} 'cs!smCss'         sm.min.css
 * @param   {string} 'smJs'             sm.min.js
 */

define(['app', 'angular', 'cs!smCss', 'smJs','/common/directive/header/header.js','cs!static/css/userCenter/addComment'], function(app, angular) {

  /*定义 addComment 控制器*/
  app.angular.controller('userCenter/addCommentCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope,
    $state, $stateParams, $http) {
    /*设置标题*/
    app.myApp.settitle($rootScope, '添加评论-美妆商城');
    // 设置 device
    app.myApp.viewport("device");
    /* 读取订单信息 */
    app.myApp.ajax({
      url:'/order/detail',
      data:{
        oid: $stateParams.oid
      }
    }, function(res){
      /*默认0颗星*/
      $(res.data.order.OrderProducts).each(function(index, item){
        item.stars = 0;
        item.index = index;
      });

      $scope.data = res.data;
      $scope.$digest();
    })

    /*改变星星*/
    $scope.changeStar = function($index, index) {
      $scope.starsLimit = true;
      $scope.data.order.OrderProducts[index].stars = $index + 1;
      $($scope.data.order.OrderProducts).each(function(index, item){
        if (!item.stars) $scope.starsLimit = false;
      });
    }

    // 限制300字 空格算字数 不能用ng-model
    $scope.textAreaFn = function($index){
      $scope.data.order.OrderProducts[$index].areaText = $("textarea").eq($index).val();
      $scope.data.order.OrderProducts[$index].areaTextLength = $("textarea").eq($index).val().length;

      if ($scope.data.order.OrderProducts[$index].areaText.length >= 300) {
        $scope.data.order.OrderProducts[$index].areaText = $scope.data.order.OrderProducts[$index].areaText.split("").slice(0,300).join("");
      }

    }

    /* 发表评论 */
    $scope.submmit = function() {
      if (!$scope.starsLimit) {
        $.toast("请勾选星级");
        return;
      }
      var comments = [];
      $($scope.data.order.OrderProducts).each(function(index, item){
        var obj = {
          product: item.productId,
          textComment: $("textarea").eq(index).val() || "剁手也值得~默默的好评！",
          stars: item.stars//,
          // "img":['as.img','aa.img']  //图片暂时没上
        };
        comments.push(obj);
      });


      $scope.starsLimit = false;
      app.myApp.ajax({
        url: '/order/saveComment',
        data: {
          orderId: $stateParams.oid,  // 订单id
          comments: comments          // 评论的商品内容json格式
        }
      }, function(res) {
        $scope.starsLimit = true;
        $scope.$digest();
        if (!res.err) {
          if (res.data.missionTip) $.completeTaskModal(res.data.missionTip);
          else $.toast('<img src="/static/img/userCenter/toast_success.png">提交成功！', 2000, 'toast_success');
          setTimeout(function(){location.href = $domain + "/order/index/status/3";}, 2000);
        } else $.toast(res.errMsg);
      })
    }

  }]);
});