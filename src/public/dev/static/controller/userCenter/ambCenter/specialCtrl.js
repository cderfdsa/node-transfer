/**招募美妆合伙人——我的大使 -美妆商城               控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'share'                share.js
 */

define([
    'app',
    'angular',
    'moment',
    'share',
    'cs!style',
    'cs!smCss',
    'smJs',
    '/common/directive/header/header.js',
    'cs!static/css/userCenter/ambCenter/special'
], function(app, angular, moment, share) {

    /* define userCenter/ambCenter/specialCtrl controller */
    app.angular.controller('userCenter/ambCenter/specialCtrl', [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$http',
        function($rootScope, $scope, $state, $stateParams, $http) {

            $.extend($scope, {
                init: function() {
                    this.staticScope();
                    this.checkBuyStatus();
                    this.getConfig();
                    // if unlogin to login page
                    if (app.myApp.iniValue.isLogin())
                        app.myApp.recordShare($http, 1, -1);    // 访问记录

                    this.scanRecord();                      // 添加扫码记录
                    app.myApp.openApp('userCenter/ambCenter/special?code=' + $stateParams.code);

                    this.includeJs();   // include js
                },

                /* initialize static $scope */
    			staticScope: function() {
    				app.myApp.settitle($rootScope, '招募美妆合伙人-美妆商城');    // set title
    				app.myApp.viewport("device");   // set viewport
                    $rootScope.ambSpecoial_inviteCode = $stateParams.code;
                    $scope.smsCaptchaText = '获取验证码';
    			},

                /* 大使套餐状态 */
                checkBuyStatus: function(){
                    app.myApp.http($http, {
                        url: '/senior/package/stat',
                        method: 'GET'
                    }, function(res){
                        $scope.saleNone = res.data;
                    })
                },

                /* 获取系统配置 */
                getConfig: function(){
                    app.myApp.http($http, {
                        url: '/system/config',
                        method: 'GET'
                    }, function(res){
                        $scope.config = res;
                        $scope.share();
                    })
                },

                /* add scan record */
                scanRecord: function(){
                    if ($stateParams.code) {
                        app.myApp.http($http, { // 添加扫码记录
                            url: '/inviteCode/scan/add',
                            defaultResErr: false,
                            data: {
                                code: $stateParams.code
                            }
                        })
                    }
                },

                /* but event */
                buy: function(){
                    // 售完
                    if ($scope.saleNone) return;

                    var secFn = function(mobile){
                        if (!mobile) {
                            $(document).on('open','.popup-bindMobile', function () {
                                $('.popup-overlay').addClass('bindMobileMask');
                            });
                            $(document).on('closed','.popup-bindMobile', function () {
                                $('.popup-overlay').remove();
                            });
                            $.popup('.popup-bindMobile');
                        } else  { // to buy page
                            location.hash = '#/userCenter/ambCenter/specialBuy';
                            $rootScope.ambSpecial_mobile = mobile;
                        }
                    }

                    // if unlogin to login page
                    if ($scope.ifLogin() == false) return;

                    // if unbind mobile
                    $scope.ifBindMbile(secFn);
                },

                /* check login */
                ifLogin: function(){
                    var hash = location.hash;
                    if (app.myApp.ifLogin(hash) == false) return false;
                },

                /* check bind mobile */
                ifBindMbile: function(secFn){
                    app.myApp.http($http, { // 获取用户信息
    					url:'/member/detail',
    					method:'GET'
    				}, function(res){
                        secFn (res.data.mobile);
    				})
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
                        } else $.toast(res.errMsg);
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

                /* 提交按钮状态 */
                canSubmit: function(){
                    $scope.active = '';
                    if ($scope.mobile && $scope.captcha)
                        $scope.active = 'active';
                },

                /* 绑定手机号 */
                submit: function(){
                    // 按钮灰色 return
                    if (!$scope.active) return;

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

                    app.myApp.http($http, {
    					url: '/member/bindMobile',
                        data: {
                            mobile: $scope.mobile,  // 手机号(必填)
                            code: $scope.captcha    // 登陆码(必填)
                        }
    				}, function(res){
                        $.toast('手机号绑定成功！');
                        $rootScope.ambSpecial_mobile = $scope.mobile;
                        location.hash = '#/userCenter/ambCenter/specialBuy';
    				})
                },

                /* include Js: scroll top */
                includeJs: function(){
                    var interval = setInterval(function(){
                        if ($(".includeJs").length) {
                            eval($(".includeJs").text());
                            clearInterval(interval)
                        }
                    }, 100)

                },

                /* share */
                share: function(){
                    var shareTitle = $scope.config['inviteSenior'].title,
                      shareDesc = $scope.config['inviteSenior'].text,
                      shareImgUrl = location.origin + '/static/img/userCenter/ambCenter/icon_share.png',
                      shareLink = $scope.config['inviteSenior'].qrcode + $stateParams.code,
                      callback = {
                        success: function() {
                          $.toast("分享成功！");
                          $(".wxfx").remove();
                          app.myApp.recordShare($http, 0, -1);
                        }
                      };

                    share.setContent(shareTitle, shareDesc, shareImgUrl, shareLink, callback);
                },

                /* popup share */
                popupShare: function(){
                    share.popupShare();

                    $("body").delegate(".modal-overlay", "click", function() { // close tip modal
                      $.closeModal();
                    });
                }
            });

            $scope.init();
        }
    ]);
});
