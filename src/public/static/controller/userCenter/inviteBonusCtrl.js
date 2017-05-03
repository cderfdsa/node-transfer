/**邀请闺蜜好友分享页-美妆商城    			 控制器 依赖JS CSS
 * @param   {string} 'app'                 	app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
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
	'cs!static/css/userCenter/inviteBonus'
], function(app, angular) {

	/* define order/confirmCtrl controller */
	app.angular.controller('userCenter/inviteBonusCtrl', [
		'$rootScope',
		'$scope',
		'$state',
		'$stateParams',
		'$http',
		function($rootScope, $scope, $state, $stateParams, $http) {

		$.extend($scope, {
			init: function() {
				this.staticScope();
                this.ifLogin();
				app.myApp.recordShare($http, 1, -1);    // 访问记录
			},

			/* initialize static $scope */
			staticScope: function() {
				app.myApp.settitle($rootScope, '邀请闺蜜好友-美妆商城'); // set title
				app.myApp.viewport("device"); // set viewport
                $scope.smsCaptchaText = '获取验证码';
			},

            /* check login */
            ifLogin: function(){
                if (app.myApp.ifLogin(location.hash, location.hash) == false) return false;
            },

			/* get image captcha */
            imgCaptcha: function(type){
                var imgModal = $.modal({
                    title: "请输入验证码",
                    text: '<input type="text" maxlength="4">' +
                        '<img src="' + $domain + '/wap/site/authcode"/>' +
                        '<a onClick="$.refreshCaptcha()">换一张</a>',
                    extraClass: 'imgCaptchaModal',
                    buttons: [{
                        text: "确认",
                        close: false,
                        onClick: function() {
                            if (!$(".imgCaptchaModal input").val()) {
                                $.toast('亲，请您输入正确的验证码！');
                                 return;
                            }
                            $scope.imgCode = $(".imgCaptchaModal input").val();

                            $.closeModal(imgModal);
                            $scope.sendCode(type);
                        }
                    }]
                });

                /* 点击 modal 关闭 dialog */
                $("body").delegate(".modal-overlay", "click", function(){
                    $.closeModal(imgModal);
                });

                $.refreshCaptcha = function() {
                    $(".imgCaptchaModal img").attr('src', $domain + '/wap/site/authcode');
                }
            },

            /* get SMS captcha */
            /* 短信/语音(0/1)验证码 */
            getCode: function(type){
                if ($scope.smsCaptchaStatus) return;

                var self = this;
                // 判断手机号
                if (!$scope.mobile) {
                    $.toast("请输入手机号！");
                    return;
                }

                if (!/^1\d{10}$/g.test($scope.mobile)) {
                    $.toast("请输入正确的手机号！");
                    return;
                }

                // 调用图形验证码
                self.imgCaptcha(type);
                $.refreshCaptcha();
            },

            /*获取验证码数据*/
            sendCode: function(type){
                app.myApp.ajax({
                    url:'/site/sendMobieCode',
                    data:{
                        mobile: $scope.mobile,
                        piccode:$scope.imgCode,
                        type: type
                    }
                }, function(res){
                    if(!res.err){
                        $.toast("验证码已经发送");
                        $scope.countDown();
                        $scope.$digest();
                    }else $.toast(res.errMsg);
                })
            },

            /* 倒计时 */
            countDown: function() {
                var time = 60;
                $scope.smsCaptchaStatus = "disabled";
                $scope.timer = setInterval(function() {
                    time --;
                    $scope.smsCaptchaText = "重新获取验证码<br>(" + time + ")";
                    if(!time) {
                        clearInterval($scope.timer);
                        $scope.smsCaptchaStatus = "";
                        $scope.smsCaptchaText = "重新获取";
                    }
                    $scope.$digest();
                }, 1000);
            },

            /* 提交 */
            submit: function(){
                // 验证
                if (!$scope.mobile) {
                    $.toast("请输入手机号！");
                    return;
                }

                if (!/^1\d{10}$/g.test($scope.mobile)) {
                    $.toast("请输入正确的手机号！");
                    return;
                }

                if (!$scope.captcha) {
                    $.toast("请输入验证码！");
                    return;
                }

                if ($scope.send) return;
                $scope.send = true;

                // 提交
				app.myApp.http($http, {
					url: '/member/invite',
					data: {
						mobile: $scope.mobile,
						inviteCode: $stateParams.code,
						code: $scope.captcha
					},
					defaultResErr: false
				}, function(res){
					$scope.send = false;
                    if(!res.err){
						$scope.showSuccess = true;
                    } else $.toast(res.errMsg);
				})
            },

            /* download app */
            downloadApp: function(){
                app.myApp.openApp(undefined, function(){
                    location.href = 'http://wechat.beautysite.cn/h5/download';
                });
            }

		});

		$scope.init();
	}]);
});

// 默认头像
