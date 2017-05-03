/**w微信红包-美妆商城               控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'moment'               moment.js
 */
define(['app', 'angular', 'moment', 'cs!smCss', 'smJs', 'cs!static/css/activity/redBag'], function(app, angular, moment) {

    /*定义 incomeDetailCtrl 控制器*/
    app.angular.controller('activity/redBagCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    	/*设置标题*/
    	app.myApp.settitle($rootScope, '微信红包-美妆商城');
    	app.myApp.viewport("device");
        $scope.domain = $domain;
        // 用户信息接口
        $scope.loadCompare = function(){
            app.myApp.ajax({
                url: '/account/userInfo',
            },function(res){
                if(!res.err){
                    $scope.user = res.data.user;
                    $scope.$digest();
                }else $.toast(res.errMsg);
            })
        }
          /* 朋友领取的红包列表 */
        function orderBonusRecieveRecord(){
            app.myApp.ajax({
              url: '/site/orderBonusRecieveRecord',
              data: {
                oid: $stateParams.oid
              }
            }, function(res){
              if (!res.err) {
                // moment转时间
                $(res.data).each(function(index, item ){
                  item.updatedAt = moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss');
                });
                $scope.rows = res.data;
                $scope.$digest();
              } else $.toast(res.errMsg);
            })
        }

        /*判断是否过期接口*/
        app.myApp.ajax({
            url: '/site/orderBonusRecieve',
            data:{
               oid: $stateParams.oid
            }
        }, function(res){
             orderBonusRecieveRecord();
            if(!res.err){           //err = 0 领取成功
                $scope.loadCompare();
                $scope.dataproduct = res.data;
                $scope.success = 2;
                $(res.data).each(function(index, item ){
                    item.startDate = moment(item.startDate).format('YYYY-MM-DD');
                    item.endDate = moment(item.endDate).format('YYYY-MM-DD');
                });
                $scope.endDate = res.data.endDate;

            } else if(res.err == 2){    //err = 2 未登录
                $scope.dataproduct = res.data;
                $scope.success = 1;
            }  else{                    //err = 1 已经领过
                $scope.loadCompare();
                $scope.success = 3;
                $scope.err = res.errMsg;
                var str1 = "该用户已领取过红包";
                if($scope.err == str1){
                    $scope.shownumber = true;
                }else{
                    $scope.shownumber = false;
                }
            }

            $scope.error = res.err;
            $scope.$digest();
        })
        /* 倒计时 */
        var time = 60;
    	$scope.buttonText = "获取验证码";
    	$scope.countDown = function() {
    		$scope.default = "default";
    		$scope.timer = setInterval(function() {
				time--;
				$scope.buttonText = time + "s 后重发";
				if (time <= 0) {
					$scope.default = "";
					$scope.buttonText = "重新获取";
					clearInterval($scope.timer);
				}
				$scope.$digest();
    		}, 1000);
    	}

        /* input 验证 */
        function validate(val) {
            var reg = /^1\d{10}$/;
            if (val.mobile && !reg.test($scope.mobile)) {
                $.toast('<img src="/static/img/activity/toast_1.png">亲，您输入的手机号码格式不正确，<br>请重新输入！', 2000, 'toast_success');
                return false;
            }
            if (val.pic && $(".input_text").val().length != 4) {
                $.toast("请输入正确的图形验证码！");
                return false;
            }
            if (val.captcha && !$scope.captchaCode) {
                $.toast("请输入短信验证码！");
                return false;
            }
            return true;
        }
        /* 点击获取验证码：1.手机号码验证 2.弹窗 3.获取后台 */
    	$scope.getCode = function(type) {
    		//1.手机号码验证
    		if (!validate({mobile:1})) return;
    		// 2.验证码弹窗
            captchaModal(type);
            // 3.刷新验证码
            $.refreshCaptcha();
        }
        /* img captcha modal */
        function captchaModal(type){
            var redBagModal = $.modal({
                title: "请输入验证码",
                text: '<div class="popup_container">'+
                            '<div class="customize_popup">' +
                                '<input type="text" maxlength="4" class="input_text"/>' +
                                '<img class="img_captcha" src="http://luwechat.com/wap/site/authcode/image.png">' +
                                '<a onClick="$.refreshCaptcha()">换一张</a>' +
                            '</div>' +
                        '</div>',
                extraClass: 'redBagModal',
                buttons:[
                    {
                        text: "确认",
                        close: false,
                        onClick: function () {
                            if (!validate({pic:1})) return;
                            $scope.piccode = $(".input_text").val();
                            $.closeModal(redBagModal);
                            $scope.sendCode(type);
                        }
                    }
                ]
            });
            /* 点击 modal 关闭 dialog */
            $("body").delegate(".modal-overlay", "click", function(){
                $.closeModal(redBagModal);
            });
        }
        /* refresh img captcha */
        $.refreshCaptcha = function(){
            $(".img_captcha").attr('src', $domain + '/public/authcode');
        }

        /* 获取验证码 (短信/语音) */
        $scope.sendCode = function(type){
            app.myApp.ajax({
                url:'/site/sendMobieCode',
                data:{
                    mobile: $scope.mobile,
                    piccode: $scope.piccode,
                    type: type
                }
            },function(res){
                if(!res.err){
                    $.toast("验证码已发送！");
                    $scope.countDown(); // 进入倒计时
                } else $.toast(res.errMsg);
            })
        }

        /* 立即领取 点击提交数据 */
        $scope.submit = function() {
            if (!validate({mobile: 1, captcha: 1})) return;

            // 点击传送数据
            app.myApp.ajax({
                url: "/site/orderBonusRecieve",
                data: {
                    oid : $stateParams.oid,
                    mobile: $scope.mobile,
                    code: $scope.captchaCode
                }
    		}, function(res) {
        		if (!res.err) {
        			$.toast("提交成功");
                    $scope.success = 2;
                    $scope.data = res.data;
                    $scope.$digest();
                    orderBonusRecieveRecord();
        		} else $.toast(res.errMsg);
    		})
    	}
        /* 跳转公众号 */
        $scope.toPublicNo = function(){
            if ($scope.error == 2) {
                // popup: 微信二维码
                var popupHtml = '<div class="popup popup_wxCode close-popup">' +
                                '<img src="/static/img/activity/wx_code.png" alt="">' +
                            '</div>';
                $.popup(popupHtml, true);
                return;
            }
             location.href = $domain;
        }
    }]);
});