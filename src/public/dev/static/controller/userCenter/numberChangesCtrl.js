/**更换手机绑定-美妆商城    					控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 * @param   {string} 'moment'               moment.js
 */

define(['app', 'angular', 'moment', 'cs!smCss', 'smJs', 'pager', 'lazyLoad', '/common/directive/header/header.js', 'cs!static/css/userCenter/numberChanges'], function(app, angular, moment) {
    /*定义 incomeDetailCtrl 控制器*/
    app.angular.controller('userCenter/numberChangesCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
        /*设置标题*/
        app.myApp.settitle($rootScope, '更换手机绑定-美妆商城');
        app.myApp.viewport("device");
        $scope.domain = $domain;

         /*用户信息*/
        app.myApp.ajax({
            url: '/account/userInfo'
        }, function(res) {
            if (!res.err) {
                $scope.userInfo = res.data.user;
                // 转化时间与手机号码筛选
                $(res.data.user).each(function(index, item) {
                    item.birthday = moment(item.birthday).format('YYYY-MM-DD');
                    var mobile = item.mobile;
                    item.filtermobile = mobile.substring(0,3) + "****" + mobile.substring(7,11);
                })
                $scope.$digest();
            } else $.toast(res.errMsg)
        })

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
            if (val.oldMobile && !reg.test($scope.oldMobile)) {
                $.toast('原手机号不正确', 2000, 'toast_success');
                return false;
            }
            if (val.newMobile && !reg.test($scope.newMobile)) {
                $.toast('手机号码输入不正确吆', 2000, 'toast_success');
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
            if (!validate({
                    oldMobile: 1
                })) return;
            if (!validate({
                    newMobile: 1
                })) return;
            // 2.验证码弹窗
            captchaModal(type);
            // 3.刷新验证码
            $.refreshCaptcha();
        }

        /* 图形验证码 */
        function captchaModal(type) {
            var redBagModal = $.modal({
                title: "请输入验证码",
                text: '<div class="popup_container">' +
                    '<div class="customize_popup">' +
                    '<input type="text" maxlength="4" class="input_text"/>' +
                    '<img class="img_captcha" src="http://luwechat.com/wap/site/authcode/image.png">' +
                    '<a onClick="$.refreshCaptcha()">换一张</a>' +
                    '</div>' +
                    '</div>',
                extraClass: 'redBagModal',
                buttons: [{
                    text: "确认",
                    close: false,
                    onClick: function() {
                        if (!validate({
                                pic: 1
                            })) return;
                        $scope.piccode = $(".input_text").val();
                        $.closeModal(redBagModal);
                        $scope.sendCode(type);
                    }
                }]
            });
            /* 点击 modal 关闭 dialog */
            $("body").delegate(".modal-overlay", "click", function() {
                $.closeModal(redBagModal);
            });
        }

        /* refresh img captcha */
        $.refreshCaptcha = function() {
            $(".img_captcha").attr('src', $domain + '/public/authcode');
        }

        /* 获取验证码 (短信/语音) */
        $scope.sendCode = function(type) {
            app.myApp.ajax({
                url: '/site/sendMobieCode',
                data: {
                    mobile: $scope.newMobile,
                    piccode: $scope.piccode,
                    type: type
                }
            }, function(res) {
                if (!res.err) {
                    $.toast("短信验证码已发送！");

                    $scope.countDown(); // 进入倒计时
                } else $.toast(res.errMsg);
            })
        }

        $scope.submit = function() {
            app.myApp.ajax({
                url: "/account/bindMobile",
                data: {
                    old_mobile: $scope.oldMobile,
                    mobile: $scope.newMobile,
                    authcode: $scope.captchaCode
                }
            }, function(res) {
                if (!res.err) {
                    $.toast(res.errMsg);
                    $scope.$digest();
                    setTimeout(function() {
                        location.href = '#/account/userinfo';
                    }, 1000);
                } else $.toast(res.errMsg)
            })
        }
    }]);
});