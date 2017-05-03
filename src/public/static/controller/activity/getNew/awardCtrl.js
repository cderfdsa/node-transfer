/**拉新活动-诊断书   						控制器 依赖JS CSS
 * @param   {string} 'app'                 	app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'share'                sharejs
 */

define([
	'app',
	'angular',
	'share',
	'cs!style',
	'cs!smCss',
	'smJs',
	'cs!static/css/activity/getNew/award'
], function(app, angular, share) {

	/*define 'activity/getNew/diagnosisCtrl' controller*/
	app.angular.controller('activity/getNew/awardCtrl', [
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
					this.wxShare();
					$scope.gift = 1 ;
				},

				initAjax:function(){
					app.myApp.http($http,{
						url:'/member/activity/award/receive', /*判断是否已领取*/
						method:'GET',
						data:{
							marketing:'5806de629fc5ad5c8dbef895'
						}
					},function(res){
						$scope.receive = res.data;
					});
					app.myApp.http($http,{
						url:'/member/activity/involve/list', /*活动拉新参与列表*/
						method:'GET',
						data:{
							marketing:'5806de629fc5ad5c8dbef895'
						}
					},function(res){
						$(res.data.rows).each(function(index,item){
							if(item.nickName.length > 4){
								item.nickName = item.nickName.substring(0,2) + "****" + item.nickName.substring(item.nickName.length-2,item.nickName.length);
							}
						})
						$scope.user = res.data;
						$scope.progressBar();
					});
				},
				// 进度条
				progressBar:function(){
					var widthNum =$scope.user.count / 30 * 100;
					$(".progressBar_list").css("width",widthNum+'%');
				},

				/* initialize static $scope */
				staticScope: function() {
					app.myApp.settitle($rootScope, '美妆笑医生-诊断书'); // set title
					app.myApp.viewport("device"); // set viewport
				},

				// 领取奖品
				Receive: function() {
					if($scope.user.count>=8&&$scope.receive==false){
						/*集齐8颗*/
						if($scope.gift==1){
							$scope.title = "气味图书馆小香瓶";
						}else if($scope.gift == 2){
							$scope.title = "BeautyPlus原液精华";
						}else{
							$scope.title = "BeautyPlus BB霜";
						}

						var ReceiveModal = $.modal({
							title: ' 恭喜你获得【 '+ $scope.title + '】一份',
							text: '<img src="static/img/activity/getNew/close.png" class="close" onClick="closeModal()"/>' +
								'<p>为保证慰问品顺利发放，请填写您的手机号码。</p>' +
								'<p><img src="static/img/userCenter/ambCenter/plum_icon.png">奖品领取后不能更换</p>' +
								'<div>' +
									'<input type="tel" placeholder="请输入手机号" id="mobile" maxlength="11" required>' +
									'<div class="customize-popup">' +
										'<input type="text" placeholder="请输入验证码" maxlength="4" class="input_text"/>' +
										'<img class="img_popup" src="' + $domain + '/wap/site/authcode"/>' +
										'<a onClick="$.refreshCaptcha()">换一张</a>' +
									'</div>' +
									'<div class="msgCode">'+
										'<input  type="tel" placeholder="请输入验证码"  class="inp col-80"  max-length="6" id="captchaCode">' +
										'<button class="getCodebtn" onClick="getCode()"></button>' +
									'</div>'+
								'</div>' +
								'<p>提示:如果手机绑定有问题，请联系客服。</p>',
							extraClass: 'ReceiveModal',
							buttons: [{
								text: "确定",
								close: false,
								onClick: function() {
									if (!$("#mobile").val()) {
										$.toast("请输入手机号码")
										return;
									};
									if (!$("#captchaCode").val()) {
										$.toast("请输入验证码")
										return;
									};
								    app.myApp.http($http, {
				                        url: '/member/activity/award/receive',
				                         method: 'POST',
				                        data:{
				                        	marketing:'5806de629fc5ad5c8dbef895',
				                        	mobile:$("#mobile").val(),
				                        	code:$("#captchaCode").val(),
				                        	awardType:$scope.gift-1
				                        }
				                    }, function(res){
				                    	$.closeModal(ReceiveModal);
				                    	location.href='#/activity/getNew/success';
				                    })
				                }
							}]
						})
					}
					$(".getCodebtn").text("获取验证码");

					// 图形验证码捕捉点发送
					$(".input_text").change(function(){
						if($(".input_text").val().length == 4){
							if (!$("#mobile").val()) {
								$.toast("请输入手机号码")
								return;
							};
							app.myApp.ajax({
								url: '/site/sendMobieCode',
								data: {
									mobile: $("#mobile").val(),
									piccode: $(".input_text").val(),
									type: 0
								}
							}, function(res) {
								if (!res.err) {
									$.toast("验证码已经发送");
									$(".customize-popup").hide();
									$scope.countDown();
									$.refreshCaptcha();
									$scope.$digest();
								} else $.toast(res.errMsg);
							})
						}
					})

					/* 短信/语音(0/1)验证码 */
					getCode = function() {
						if (!$("#mobile").val()) {
							$.toast("请输入手机号码")
							return;
						};
						$(".customize-popup").show();
						$(".input_text").val("");
					}

					$.refreshCaptcha = function() {
						$(".img_popup").attr('src', $domain + '/wap/site/authcode');
					}

					closeModal = function() {
						$.closeModal(ReceiveModal);
					}
				},

				/* 倒计时 */
				countDown: function() {
					var time = 60;
					var timer = setInterval(function() {
						time--;
						$(".getCodebtn").text("重新获取" + time);
						$(".getCodebtn").addClass("prohibit");
						$(".getCodebtn").attr({
							"disabled": "disabled"
						});
						if (time <= 0) {
							clearInterval(timer);
							$(".getCodebtn").text("重新获取");
							$(".getCodebtn").removeClass("prohibit");
							$(".getCodebtn").removeAttr("disabled")
						}
						$scope.$digest();
					}, 1000);
				},

				/*点击跳转*/
				toClick:function(type){
					if(type==1){
						location.href = "#/activity/getNew";
					}else{
						location.href="#/activity/getNew/diagnosis";
					}
				},

				/*微信分享*/
				wxShare: function() {
					var shareTitle = "美妆笑医室，专业拯救不开心",
						shareDesc = "据说99%的大学生都有”病“，不信来测~还有精美化妆品拿哦~",
						shareImgUrl = location.origin + '/static/img/userCenter/ambCenter/icon_share.png',
						shareLink = location.origin + '/auth/weixin/?backUrl=/activity/getNew',
						callback = {
							success: function() {
								$.toast("分享成功！");
				                app.myApp.recordShare($http, 0, -1);
							}
						};

					share.setContent(shareTitle, shareDesc, shareImgUrl, shareLink, callback);
				}

			});

			$scope.init();
		}
	]);
});