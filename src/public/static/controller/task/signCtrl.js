/**每日签到-美妆商城    						        控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */

define([
  'app',
  'angular',
  'cs!style',
  'cs!smCss',
  'smJs',
  '/common/directive/header/header.js',
  'cs!static/css/task/sign'
], function(app, angular) {

  /* define task/signCtrl controller */
  app.angular.controller('task/signCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$http',
    function($rootScope, $scope, $state, $stateParams, $http) {
    $.extend($scope, {
        init: function() {
          this.staticScope();
          this.initAjax();
        },

        /* initialize static $scope */
        staticScope: function() {
          // set title
          app.myApp.settitle($rootScope, '每日签到-美妆商城');
          app.myApp.viewport("device"); // set device

          /* 月21号之后 “连续签到” 显示下半部分 */
          $scope.nextHalfMonth = new Date().getDate() > 21 ? 'nextHalfMonth' : '';
        },

        /* initialize ajax */
        initAjax: function(){
          // 用户信息
          app.myApp.http($http, {
            url:'/member/detail',
            method: 'GET',
            data: {v:1.0}
          }, function(res){
              $scope.userInfo = res.data;
          });

          // 签到日历
          app.myApp.ajax({
            url: '/account/signCalendar'
          }, function(res) {
            if (!res.err) {
              $scope.signdNo = 0;
              $(res.data).each(function(index, item){
                item.passSignd = item.date < (new Date().getTime()-3600*24*1000) ? item.signd : true;  // 未签到
                item.signd && $scope.signdNo++;                                          // 共签到
                item.today = new Date().getDate() == new Date(item.date).getDate();  // 是否是今日
              });

              /*若每天数组为空 传空数组*/
              $scope.signCalendar = [];
              for (var i = 0; i < new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); i++) {
                var isPush = false;
                $(res.data).each(function(index, item){
                  if(new Date(item.date).getDate() - 1 == i) {
                    $scope.signCalendar.push(item);
                    isPush = true;
                  }
                });
                if (!isPush) $scope.signCalendar.push({name:''});
              }

              $scope.todayName = $scope.signCalendar[new Date().getDate()-1].name;        // 今日奖励
              $scope.$digest();
              $scope.continuityFn();
            } else $.toast(res.errMsg);
          });

          // 获取系统配置
          app.myApp.http($http, {
            url: '/system/config',
            method: 'GET',
            loading: false
          }, function(res){
            $scope.config = res;
          });
        },

        /* 连续签到 */
        continuityFn: function(){
          app.myApp.ajax({
            url: '/account/signContinuity'
          }, function(res) {
            if (!res.err) {
              $scope.signContinuity = res.data;
              $scope.$digest();
              $scope.signModalFn();
            } else $.toast(res.errMsg);
          });
        },

        /** 领取奖品弹窗
         *  type 枚举:
         *      0: 连续7天
         *      1: 连续14天
         *      2: 连续21天提示
         *      3: 连续21天领取
         *      4: 连续7天领取
         *      5: 连续14天领取
         *      6: 连续21天领取成功
         *      7: 连续21天领取成功
         *      8: 签到成功颜值和小样
         *      9: 签到成功红包
         */
        signModalFn: function(){
          var title = [
              '连续签到7天奖励',
              '连续签到14天奖励',
              '连续签到21天奖励',
              '恭喜亲，您可领取以下奖品',
              '恭喜亲，领取成功',
              '恭喜亲，领取成功',
              '恭喜亲，领取成功',
              '恭喜亲，领取成功',
              '签到成功',
              '签到成功'
            ],
            text = ['<img src="/static/img/task/type0.png">',
                  '<img src="/static/img/task/type1.png">',
                  '<img src="/static/img/task/type2.png">',
                  '<div class="typeImgBox">'
                    + '<img src="/static/img/task/type2.png">'
                    + '<img class="' + ((!$scope.signContinuity[2].canReceived || !$scope.signContinuity[3].canReceived)?'':'hidden') + ' ' + (!$scope.signContinuity[2].canReceived?'typeNoneLeft':'typeNoneRight') + '" src="/static/img/task/typeNone.png">'
                    + '<div class="radio"><input type="radio" ' + (!$scope.signContinuity[2].canReceived ? 'disabled' : '') + ' name="type3" value="2"></div>'
                    + '<div class="radio"><input type="radio" ' + (!$scope.signContinuity[3].canReceived ? 'disabled' : '') + ' name="type3" value="3"></div>',
                  '<img src="/static/img/task/type4.png"><div class="right"><p>亲，真棒，500颜值到手咯~</p><p>(本月已签到' + $scope.signdNo + '次)</p><div>',
                  '<img src="/static/img/task/type6.png"><div class="right"><p>亲，真棒，20元红包到手咯~</p><p>(本月已签到' + $scope.signdNo + '次)</p><div>',
                  '<img src="/static/img/task/type4.png"><div class="right"><p>亲，真棒，35元红包到手咯~</p><p>(本月已签到' + $scope.signdNo + '次)</p><div>',
                  '<img src="/static/img/task/type5.png"><div class="right"><p>亲，真棒，禾宝本草祛痘面膜到手咯~</p><p>(本月已签到' + $scope.signdNo + '次)</p><div>',
                  '<img src="/static/img/task/type5.png"><div class="right"><p>亲，真棒，' + $scope.signCalendar[new Date().getDate()-1].name + '到手咯~</p><p>(本月已签到' + ($scope.signdNo + 1) + '次)</p><div>',
                  '<img src="/static/img/task/type6.png"><div class="right"><p>亲，真棒，' + $scope.signCalendar[new Date().getDate()-1].name + '到手咯~</p><p>(本月已签到' + ($scope.signdNo + 1) + '次)</p><div>'
              ],
            desc = [,,,,,,
              '颜值可在颜值兑换频道兑换',
              '颜值可在颜值兑换频道兑换，礼品可在购物车中查看！',
              '颜值可在颜值兑换频道兑换','可在“我的”中“红包”中查看！'
            ],
            buttons = [
              [{text: '我知道了'}],
              [{text: '我知道了'}],
              [{text: '我知道了'}],
              [{text: '取消'}, {
                text: '立即领取',
                close: false,
                onClick: function () {
                  if (!$('[name="type3"]:checked').val()) {
                    $.toast("请选择奖励！"); return;
                  } $.closeModal(signModal);
                  $scope.signAward($('[name="type3"]:checked').val(), 1);
                }}],
              [{text: '我知道了'}, {
                text: '立即查看',
                onClick: function () {
                  location.href = $domain + $scope.config.wechatUrl.integralList;
                }}],
              [{text: '我知道了'}, {
                text: '立即查看',
                onClick: function () {
                  location.href = $domain + $scope.config.wechatUrl.bonusList;  //我的红包
                }}],
              [{text: '我知道了'}, {
                text: '立即查看',
                onClick: function () {
                  location.href = $domain + $scope.config.wechatUrl.bonusList;
                }}],
              [{text: '我知道了'}, {
                text: '立即查看',
                onClick: function () {
                  location.href = $domain + $scope.config.wechatUrl.cartList; // 购物车
                }}],
              [{text: '我知道了',
                onClick: function () {
                  $scope.slideUp = false; //自动上拉 $scope.$digest();
                }}, {
                text: '立即查看',
                onClick: function () { // type=2 小样 购物车 type=0 颜值 颜值换礼
                  var url = $domain + ($scope.signCalendar[new Date().getDate()-1].type == 2 ? $scope.config.wechatUrl.cartList : $scope.config.wechatUrl.integralList);
                  location.href = url;
                }}],
              [{text: '我知道了',
                onClick: function () {
                  $scope.slideUp = false; //自动上拉
                  $scope.$digest();
                }}, {
                text: '立即查看',
                onClick: function () {
                location.href = $domain + $scope.config.wechatUrl.bonusList;
              }}]
            ];

          $scope.signModal = function(type, date, signd, $event){

            // 弹窗
            function modal (){
                window.signModal = $.modal({
                  title: title[type] + '<div class="close pull-right" onClick="$.closeModal(signModal)"><img src="/static/img/task/sign_modal_close.png"></div>',
                  text: '<div class="type' + type + '">' +
                          '<div class="typeBox">' + text[type] + '</div>' +
                        '</div>',
                  afterText:  desc[type] ? '<div class="desc"><img src="/static/img/task/info.png">' + desc[type] + '</div>' : '',
                  extraClass: 'signModal modal_type' + type,
                  buttons: buttons[type]
                });
            }

            // 签到领奖
            if (type == 8 || type == 9) {
              if (date && (new Date(date).getDate() != new Date().getDate() || signd)) return;
              $event.stopPropagation(); //阻止冒泡
              app.myApp.ajax({
                url: '/account/sign'
              }, function(res) {
                if (!res.err) {
                  $scope.signCalendar[new Date().getDate()-1].signd = true;
                  $scope.signdNo ++;
                  $scope.$digest();
                  $scope.continuityFn();
                  if (res.data && res.data.missionTip)
                    $.completeTaskModal(res.data.missionTip);
                  else modal();
                } else $.toast(res.errMsg);
              });
            } else {
              modal();
            }
          };
        },

        /* 提交领奖 */
        signAward: function($index, type){
          if ($index==2 && !type) {
            $scope.signModal(3);
            return;
          }

          app.myApp.ajax({
            url: '/account/signAward',
            data: {awardId: $scope.signContinuity[$index]._id}  // 连续签到的id
          }, function(res) {
            if (!res.err) {
              if($index == 2 || $index == 3) {
                $scope.signContinuity[2].canReceived = false;
                $scope.signContinuity[3].canReceived = false;
              }
              $scope.$digest();
              $scope.signModal(parseInt($index) + 4);
            } else $.toast(res.errMsg);
          })
        },

        /* 签到表展开收起 */
        slideFn: function($event){
          $event.stopPropagation(); //阻止冒泡
          $scope.slideUp = !$scope.slideUp;
        },

        /* 点击页面收起 */
        slideUpFn: function(){
          $scope.slideUp = false;
        },

        headLeftFn: function(){
          if(/fromSignIn/g.test(location.hash)){
            location.href = '#/home';
          }else{
            location.href = '#/userCenter';
          }
        },

        headRightFn: function(){
          location.href = '#/task/signRecord';
        }

    });

    $scope.init();
  }]);
});