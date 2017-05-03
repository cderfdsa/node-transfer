/**领取指定的商品红包-美妆商城    						控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'moment'               moment.js
 */

define(['app', 'angular', 'moment', 'cs!smCss', 'smJs', 'cs!static/css/activity/goodsRedPacket'], function(app, angular, moment) {

	/*定义 incomeDetailCtrl 控制器*/
	app.angular.controller('activity/goodsRedPacketCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
		/*设置标题*/
		app.myApp.settitle($rootScope, '领取指定的商品红包-美妆商城');
		$scope.domain = $domain;
		$scope.showSucc = false;
		app.myApp.viewport("device");
		//用户信息
		$scope.user = function(){
	        app.myApp.ajax({
	            url: '/account/userInfo',
	        },function(res){
	            if(!res.err){
	               $scope.datauser = res.data;
	                $scope.$digest();
	            }else $.toast(res.errMsg);
	        })
	    }

		/*判断是否过期接口*/
		app.myApp.ajax({
			url: '/sale/apointGoodsDetail',
			data:{
				shareId: $stateParams.oid
			}
		}, function(res){
			if(!res.err){
				$scope.dataproduct = res.data;
				if(res.data == null){
					$scope.part = 2;
				}else{
					$(res.data).each(function(index, item ){
			          	item.startDate = moment(item.startDate).format('YYYY-MM-DD');
			          	item.endDate = moment(item.endDate).format('YYYY-MM-DD');
			        });
					$scope.endDate = res.data.endDate;
					timeCompare();
				}
				$scope.$digest();
			} else $.toast(res.errMsg);
		})

		/*系统配置*/
		app.myApp.ajax({
			url: '/site/sysconf'
		}, function(res){
			if(!res.err){
				$scope.date = res.data.coupon.apointGoodsBonusExpire;
				$scope.$digest();
			} else $.toast(res.errMsg);
		})

		/*判断是否过期*/
		function timeCompare(){
			var time = new Date();
			day = moment(time).format('YYYY-MM-DD');
			if (day > $scope.endDate){
				$scope.part = 2;
			} else {
				$scope.loadCompare();
			}
		}

		/*是否登录*/
		$scope.loadCompare = function(){
			app.myApp.ajax({
				url: '/sale/apointGoodsRecieve',
				data:{
					shareId:$stateParams.oid,
					memberCode:$stateParams.code
				}
			},function(res){
				if(!res.err){        		//err=0 领取成功
					$scope.part = 1;
					$scope.user();
				}else if(res.err == 2 ){   //err = 2 未登录
					$scope.part = 0;
				}else{						//err = 1 已经领取
					$scope.part = 3;
					$scope.user();
					$scope.err = res.errMsg;
					if( $scope.err == "非常抱歉，该商品指定红包已过期，已不能领取"){
						$scope.part = 2;
					}
				}
				$scope.error = res.err;
				$scope.$digest()
			})
		}

		$scope.buttonText = "获取验证码";
		/*倒计时方法*/
		$scope.countDown = function() {
			var time = 60;
			$scope.buttonStatus = "disabled";
			$scope.timer = setInterval(function() {
				time--;
				$scope.buttonText = time + "s后重发";
				if(!time) {
					clearInterval($scope.timer);
					$scope.buttonStatus = "";
					$scope.buttonText = "重新发送";
				}
				$scope.$digest();
			}, 1000);
		}

		/*弹窗*/
		function imgcodeModal(type) {
			var imgModal = $.modal({
				title: "请输入验证码",
				text: '<div class="popup_container">' +
					'<div class="customize-popup">' +
					'<input type="text" maxlength="4" class="input_text"/>' +
					'<img class="img_popup" src="http://luwechat.com/wap/site/authcode/image.png"/>' +
					'<a onClick="$.refreshCaptcha()">换一张</a>' +
					'</div>' +
					'</div>',
				extraClass: 'imgModal',
				buttons: [{
					text: "确认",
					close: false,
					onClick: function() {
						if (!$(".input_text").val()) {
							$.toast('<img src="static/img/activity/toast_1.png">亲，请您输入正确的验证码！', 2000, 'toast_success');
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
		}

		/*刷新图形验证码*/
		$.refreshCaptcha = function() {
			$(".img_popup").attr('src', $domain + '/public/authcode');
		}

		/*获取验证码数据*/
		$scope.sendCode = function(type){
			app.myApp.ajax({
				url:'/site/sendMobieCode',
				data:{
					mobile:$scope.userNumber,
					piccode:$scope.imgCode,
					type:type
				}
			},function(res){
				if(!res.err){
					$.toast("验证码已经发送")
					$scope.countDown();
					$scope.$digest();
				}else $.toast(res.errMsg);
			})
		}

		/*获取验证码*/
		$scope.getCode = function(type) {
			//号码验证
			var reg = /^1\d{10}$/;
			if (!reg.test($scope.userNumber)) {
				$.toast('<img src="/static/img/activity/toast_1.png">亲，您输入的手机号码格式不正确，<br>请重新输入！', 2000, 'toast_success');
				return;
			}
			//图形验证码弹窗
			imgcodeModal(type);
			// 刷新图形验证码
			$.refreshCaptcha();
		}

		/*立即领取*/
		$scope.submit = function(){
			if(!$scope.userCode){
				$.toast('<img src="/static/img/activity/toast_1.png">亲，请您输入正确的验证码！', 2000, 'toast_success');
				return;
			}
			app.myApp.ajax({
				url: '/sale/apointGoodsRecieve',
				data:{
					shareId:$stateParams.oid,
					memberCode:$stateParams.code,
					mobile:$scope.userNumber,
					code:$scope.userCode
				}
			},function(res){
				if(!res.err){
					$.toast("提交成功");
					$scope.part = 1;
					$scope.data = res.data;
					$scope.$digest();
				}else $.toast(res.errMsg)
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
            location.href = '#/goods/detail/' + $scope.dataproduct.product._id;
        }
	}]);
});
