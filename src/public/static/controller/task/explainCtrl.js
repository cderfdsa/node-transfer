/**任务说明-美妆商城    						        控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */

define(['app', 'angular', 'cs!style', 'cs!smCss', 'smJs','/common/directive/header/header.js', 'cs!static/css/task/explain'], function(app, angular) {

  /*定义 explainCtrl 控制器*/
  app.angular.controller('task/explainCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    /*设置标题*/
    app.myApp.settitle($rootScope, '任务说明-美妆商城');
    app.myApp.viewport("device");

    /* 初始化数据 */
    $scope.userType = $.getParam("type") == 1 ? 's' : 'l';    // 用户类型
    $scope.userLevel = $.getParam("level") ? $.getParam("level") : 1;   // 用户等级

    var data_l = [{
      header: {
          head: "累计完成任意50个L1任务即可升级到L2",
          subheader: "消费满200元即可快速升级到L2"
      },
      content: [{
          title: "购买1倍颜值",
          subTitle: ""
      },{
          title: "每月2次免费试用",
          subTitle: "每次8件以内商品"
      },{
          title: "月度优惠券发放",
          subTitle: "总价值60元"
      },{
          title: "颜值兑换商品",
          subTitle: "L1商品区"
      }]
    }, {
      header: {
          head: "累计完成任意40个L2任务即可升级到L3",
          subheader: "消费满1000元即可快速升级到L3"
      },
      content: [{
          title: "购买2倍颜值",
          subTitle: ""
      },{
          title: "每月3次免费试用",
          subTitle: "每次8件以内商品"
      },{
          title: "月度优惠券发放",
          subTitle: "总价值100元"
      },{
          title: "颜值兑换商品",
          subTitle: "L1/L2商品区"
      },{
          title: "解锁L2任务",
          subTitle: "开启赚钱模式"
      },{
          title: "超值专属大礼包",
          subTitle: "总价值188元"
      }]
    }, {
      header: {
          head: "累计完成任意40个L3任务即可升级到校园大使",
          subheader: "消费满3000元即可快速升级到校园大使"
      },
     content: [{
          title: "购买3倍颜值",
          subTitle: ""
      },{
          title: "每月5次免费试用",
          subTitle: "每次8件以内商品"
      },{
          title: "月度优惠券发放",
          subTitle: "总价值150元"
      },{
          title: "颜值兑换商品",
          subTitle: "L1/L2/L3商品区"
      },{
          title: "VIP专属生日礼",
          subTitle: ""
      },{
          title: "超值专属大礼包",
          subTitle: "总价值388元"
      }]
    }];
    var data_s = [{
      header: {
          head: "绑定20个用户可升级到S2",  //s1
      },
      content: [{
          title: "购买1倍颜值",
          subTitle: ""
      },{
          title: "月度优惠券发放",
          subTitle: "总价值60元"
      }]
    }, {
      header: {
          head: "用户40个及月销售额满2000元", //s2
      },
      content: [{
          title: "开启赚钱任务",
          subTitle: "享受任务底薪"
      },{
          title: "8%提成比例",
          subTitle: ""
      },{
          title: "购买2倍颜值",
          subTitle: ""
      },{
          title: "颜值兑换商品",
          subTitle: "S1/S2商品区"
      },{
          title: "月度优惠券发放",
          subTitle: "总价值100元"
      }]
    }, {
      header: {
          head: "用户80个及月销售额满5000元", //s3
          subheader: ""
      },
     content: [{
          title: "开启中级赚钱任务",
          subTitle: "销售任务底薪"
      },{
          title: "10%提成比例",
          subTitle: ""
      },{
          title: "购买3倍颜值",
          subTitle: ""
      },{
          title: "颜值兑换商品",
          subTitle: "S1/S2/S3商品区"
      },{
          title: "月度优惠券发放",
          subTitle: "总价值150元"
      },{
          title: "VIP专属生日礼",
          subTitle: ""
      }]
    }, {
      header: {
          head: "您已经是最高级了，继续保持哦~", //s4
          subheader: ""
      },
     content: [{
          title: "开启高级赚钱任务",
          subTitle: "每月固定底薪300元"
      },{
          title: "12%提成比例",
          subTitle: ""
      },{
          title: "购买4倍颜值",
          subTitle: ""
      },{
          title: "颜值兑换商品",
          subTitle: "SI/S2/S3/S4商品区"
      },{
          title: "月度优惠券发放",
          subTitle: "总价值180元"
      },{
          title: "VIP专属生日礼",
          subTitle: ""
      }]
    }];

    // var dataFn = function(){
    $scope.data = $scope.userType == "s" ? data_s : data_l;

    if($scope.data.length>3){
      $scope.hideTab = true;
    }
    $scope.levelStyle = (100 / $scope.data.length).toFixed(2) + "%";

    // 等级循环加空数据和更多，补齐九宫格
    var more = {
        title: "更多特权福利",
        subTitle: "敬请期待",
        more: true
      };

    $($scope.data).each(function(index, item){
      item.content.push(more);

      var emptyArrLength = 9 - item.content.length;
      for (var i = 0; i < emptyArrLength; i++) {
        item.content.push({});

      }
    });
    $scope.data[$scope.userLevel - 1 || 0].active = 'active';
    $scope.content = $scope.data[$scope.userLevel - 1 || 0];
    // }

    /* tab标签切换 */
    $scope.titles = [{
      text: '升级说明',
      active: 'active'
    }, {
      text: '任务规则',
      active: ''
    }];

    $scope.rules = [false, false, false];

    $scope.tabTitleFn = function($index){
      $($scope.titles).each(function(index, item) {
        item.active = '';
      });
      $scope.titles[$index].active = 'active';

      // 切换到任务规则的动画
      if ($index == 1) {
        $scope.rulesActive = $scope.data;
        setTimeout(function(){
          $(".active .taskContent").height($(".active ul").height());
        }, 50)
      } else  {
        $scope.rulesActive = [];
        $(".taskContent").height(0);
      }
    }

    /* 二级选项卡切换 */
    $scope.tab2Fn = function($index){
      $($scope.data).each(function(index, item) {
        item.active = '';
      });
      $scope.data[$index].active = 'active';
      $scope.content = $scope.data[$index];
    }
    /* 任务规则动画 */
    $scope.slideRulesFn = function($event){
      // $(".taskContent").height(0);
      // var $taskContent = $($event.target).next(".taskContent");
      // $taskContent.height($taskContent.find("ul").height());
    }
  }]);
});