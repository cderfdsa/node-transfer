/**
 * form 表单指令 传参实现表单的定制化
 * 1. 在 js 中引入指令： '/common/directive/form/form.js'
 * 2. html 中 初始化：
 * <formtemplate
		ng-formlists="[{
			text: '短信收不到？',
			btnText: '尝试语音验证码',
			type: 'voice'
		}, {
			tpl: '已绑定手机号码<span>138 2653 0235</span>',
			type: 'text'
		}, {
			placeholder: '输入手机号',
			type: 'mobile',
			valid: '/^1\\d{10}$/g',
			tip: '请输入正确的手机号码~',
			data: 'mobile'
		}, {
			placeholder: '输入验证码',
			type: 'smsCaptcha',
			valid: '/.{2,10}/g',
			tip: '请输入正确的验证码~',
			data: 'code'
		},{
			placeholder: '输入密码',
			type: 'password',
			valid: '/.{2,20}/g',
			tip: '请输入密码~',
			data: 'passwd'
		}, {
			text: '登录',
			type: 'submit'
		}]"
		ng-url="'/community/usercenterCommunityStat'"
		ng-sucback="sucback"
		ng-toastclass="'toast-login'"
	>
	</formtemplate>
 */

define(['app', 'md5', 'cs!./formtemplate'],function (app, md5) {
    app.angular.directive('formtemplate', function() {
	    return {
	        restrict: 'E',
	        replace: true,
	        scope : {
	            formlists : '=ngFormlists',
	            sucback: '=ngSucback',
	            url: '=ngUrl',
	            toastclass: '=ngToastclass',
	            adddata: '=ngAdddata',
	            suctip: '=ngSuctip'
	        },
	        templateUrl: '/common/directive/formtemplate/formtemplate.html',
	        link : function($scope, $element, $attrs) {
	         	$.extend($scope, {
	         		init: function(){
	         			this.mergeData();
	         			this.remeComplete();
	         		},

	        		/* 合并$scope.formlists */
	         		mergeData: function(){
	         			$scope.smsCaptchaText = '获取验证码';
	         			$scope.defaultFormlists = [{
							text: '短信收不到？',
							btnText: '尝试语音验证码',
							type: 'voice'
						},{
							tpl: '',
							type: 'text'
						}, {
							icon: '/common/directive/formtemplate/icon_mobile.png',
							icon_close: '/common/directive/formtemplate/icon_close.png',
							placeholder: '输入原手机号',
							type: 'old_mobile',
							valid: '/^1\\d{10}$/g',
							tip: '请输入正确的手机号码~',
							data: 'mobile'
						},{
							icon: '/common/directive/formtemplate/icon_mobile.png',
							icon_close: '/common/directive/formtemplate/icon_close.png',
							placeholder: '输入手机号',
							type: 'mobile',
							valid: '/^1\\d{10}$/g',
							tip: '请输入正确的手机号码~',
							data: 'mobile'
						}, {
							icon: '/common/directive/formtemplate/icon_captcha.png',
							icon_close: '/common/directive/formtemplate/icon_close.png',
							placeholder: '输入验证码',
							type: 'smsCaptcha',
							valid: '/.{2,10}/g',
							tip: '请输入正确的验证码~',
							data: 'code'
						},{
							icon: '/common/directive/formtemplate/icon_passsword.png',
							icon_close: '/common/directive/formtemplate/icon_close.png',
							iconRight: '/common/directive/formtemplate/icon_noSee.png',
							iconRightSee: '/common/directive/formtemplate/icon_see.png',
							placeholder: '输入密码',
							type: 'password',
							valid: '/.{2,20}/g',
							tip: '请输入密码~',
							data: 'passwd'
						}, {
							text: '登录',
							type: 'submit'
						}];

						$scope.formlist = [];
			        	$($scope.formlists).each(function(index, item){
			        		$($scope.defaultFormlists).each(function(i, it){
			        			if (item.type == it.type) {
			        				$scope.formlist[index] = $.extend(it, item);
			        			}
			            	});
			            });
	         		},

	         		/* fix autoComplete */
	         		remeComplete: function(){
	         			setTimeout('$("[hidden]").remove()', 1000);
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
								$scope.smsCaptchaText = "重新获取验证码";
							}
							$scope.$digest();
						}, 1000);
					},

					/*获取验证码数据*/
					sendCode: function(type){
						var mobile;
						$($scope.formlist).each(function(index, item){
			            	if (item.type == 'mobile') {
			            		mobile = item.value;
			            	}
			            });

						app.myApp.ajax({
							url:'/site/sendMobieCode',
							data:{
								mobile: mobile,
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

	         		/* 图形验证码 */
	         		imgCaptcha: function(type){
						var imgModal = $.modal({
							title: "请输入验证码",
							text: '<div class="popup_container">' +
								'<div class="customize-popup">' +
								'<input type="text" maxlength="4" class="input_text"/>' +
								'<img class="img_popup" src="' + $domain + '/wap/site/authcode"/>' +
								'<a onClick="$.refreshCaptcha()">换一张</a>' +
								'</div>' +
								'</div>',
							extraClass: 'formTplImgModal',
							buttons: [{
								text: "确认",
								close: false,
								onClick: function() {
									if (!$(".input_text").val()) {
										$.toast('亲，请您输入正确的验证码！', 2000, $scope.toastclass || 'toast-formtemplate');
										 return;
									}
									$scope.imgCode = $(".input_text").val();

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
							$(".img_popup").attr('src', $domain + '/wap/site/authcode');
						}
	         		},

	         		/* 短信/语音(0/1)验证码 */
	         		getCode: function(type){
	         			if ($scope.smsCaptchaStatus) return;

	         			var self = this;
	         			// 判断手机号
	         			var mobile;
	         			$($scope.formlist).each(function(index, item){
			            	if (item.type == 'mobile' && item.valid) {
			            		if (!eval(item.valid).test(item.value)) {
			            			$.toast(item.tip, 2000, $scope.toastclass || 'toast-formtemplate');
			            			return mobile = false;;
			            		}
			            	}
			            });

			            if (mobile == false) return;

	         			// 调用图形验证码
	         			self.imgCaptcha(type);
	         			$.refreshCaptcha();
	         		},

	         		/* 提交按钮状态 */
	         		canSubmit: function(){
	         			var can = true;
		         		$($scope.formlist).each(function(index, item){
	         				if (item.valid) {
			            		if (!item.value) {
			            			return can = false;
			            		}
		         			}
				        });

			            $scope.active = ['active', ''][Number(!can)];
	         		},

	         		/* 密码显隐 */
	         		seePwd: function(){
	         			$scope.showPwd = !$scope.showPwd;
	         		},

	         		/* 清空 */
	         		clearEmpty: function($index){
	         			$scope.formlist[$index].value = '';
	         		},

	         		/* 提交 */
	         		submit: function(){
	         			// 按钮灰色 return
	         			if (!$scope.active) return;

	         			// 验证
	         			var validStatus = true, data = {};
	         			$($scope.formlist).each(function(index, item){
			            	if (item.valid) {
			            		if (!eval(item.valid).test(item.value)) {
			            			$.toast(item.tip, 2000, $scope.toastclass || 'toast-formtemplate');
			            			return validStatus = false;
			            		}
			            		if (item.type == "password") data[item.data] = md5.hex_md5(item.value);
			            		else data[item.data] = item.value;
			            	}
			            });

			            if (!validStatus || $scope.send) return;
          				$scope.send = true;

			            // 提交
			            app.myApp.ajax({
							url: $scope.url,
							data: $.extend(data, $scope.adddata)
						}, function(res){
							$scope.send = false;
							if(!res.err){
								$.toast($scope.suctip || '提交成功！', 2000, $scope.toastclass || 'toast-formtemplate');
								$scope.sucback && $scope.sucback(res);
								$scope.$digest();
							} else $.toast(res.errMsg);
						})
	         		}

	         	});

	         	$scope.init();

	        }
	    };
	});
});
