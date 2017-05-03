/**拉新活动-诊断书   							控制器 依赖JS CSS
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
	'cs!static/css/activity/getNew/diagnosis'
], function(app, angular, share) {

	/*define 'activity/getNew/diagnosisCtrl' controller*/
	app.angular.controller('activity/getNew/diagnosisCtrl', [
		'$rootScope',
		'$scope',
		'$state',
		'$stateParams',
		'$http',
		function($rootScope, $scope, $state, $stateParams, $http) {

			$.extend($scope, {
				init: function() {
					this.staticScope();
					this.remindModal();
					this.productDiagnosis();
				},

				/* initialize static $scope */
				staticScope: function() {
					app.myApp.settitle($rootScope, '美妆笑医生-诊断书');	// set title
					app.myApp.viewport("device");	// set viewport

					// 病症
					$scope.result = [
						'考试压线狂妄症',
						'睡眠综合症',
						'点名精分症',
						'敛财作死症',
						'快递性肾上腺素分泌失调症',
						'篮球场多巴胺分泌失调症',
						'一卡通遗落狂躁症',
						'食堂绝望症晚期',
						'碰书就困疲乏症',
						'考试易挂烦燥症',
						'熬夜过多幻想症',
						'卖爱豆安利职业病',
						'单身狗通话时间焦虑症',
						'学渣升级无望症',
						'文理科内分泌紊乱症',
						'不划重点狂躁症',
						'不化妆会死症',
						'月光尴尬症',
						'周一综合症'
					];

					// 描述
					$scope.symptom = [
						'考前虽焦虑可还是果断弃书玩耍，考试凭三流的找规律法则终获及格，请叫我赌神。',
						'永远在熬夜失眠和嗜睡逃课之间疯狂的任性游走。',
						'跨越性别的羁绊，穿越地域的阻隔，体验表演的乐趣，荣获专业太极团体组一名',
						'课外自加BUFF的兼职小能手，终究输给了节日折扣，和你那疯狂撸单的右手。',
						'能让我兴奋地从床上蹦起的，就只有快递小哥的短信了。',
						'经过篮球场感觉自己恋爱了。',
						'去洗澡时一卡通没带，去超市时一卡通没带，去食堂时一卡通没带，最绝望的是，去考试时发现一卡通竟然也没带！',
						'食堂排骨不太新鲜，问师傅：“我发现这星期的排骨没有上星期的好吃。”师傅回答：“胡说，这个就是上星期的排骨。”',
						'书还是要有的，万一没它睡不着了呢。',
						'原本我的梦想是成为一名学霸，现如今，我只想罢学。',
						'你丑你先睡，我天天被自己美得睡不着。',
						'主业追星，副业学生。唉同学你好，来一份安利吧。',
						'这个月通话时长还剩500分钟怎么破？',
						'如果能穿越时空，我一定往牛顿家门口种一片榴莲树！！！',
						'理科生版：叶的分离，是脱落酸的追求，还是叶黄素的不挽留。文科生版：因为它是温带落叶阔叶林。',
						'所有不以划重点为考试前提的老师，都是在耍流氓。最令人绝望的不是重点太多，而是划了太多没有考的重点。',
						'我们买的不是化妆品，是男朋友啊~~~',
						'打电话给妈：“妈，月底又没钱花了诶。”老妈责备到：“钱不够花了怎么不早说？”我略感动，心想这次可以多要点，老妈说：“早说我就不接这个电话，给你省点电话费。”~~~··',
						'“亲，我好像感冒了，浑身发软，为了不给同学们传染，我就不去上课，记得帮我答个到”......'
					];
				},

				// 生成诊断书
				productDiagnosis: function(fresh){
					if (fresh) {	// 重新生成
						localStorage.removeItem('getNewDiagnosisData');
					}

					$scope.getData(function(data){
						data.bgImage = document.getElementById("bg_diagnosis");
						data.headImage = document.getElementById("headImg");
						data.qrCodeImage = document.getElementById("qrCode");

						if (fresh) {
							var canvas = $scope.convertImageToCanvas(data);
							$scope.diagnosisSrc = canvas.toDataURL('image/png');
						} else {
							$("#headImg, #qrCode").on("load", function(){
								var canvas = $scope.convertImageToCanvas(data);
								$scope.convertCanvasToImage(canvas);
                				$scope.wxShare();
							});
						}
					})
				},

				/* get ajax data */
				getData: function(callback){
                	app.myApp.http($http, {
	                    url: '/member/activity/qrcode',
	                    method: 'GET'
	                }, function(res){
	                	if (localStorage.getNewDiagnosisData) {
	                		var i = JSON.parse(localStorage.getNewDiagnosisData)['i'];
	                		res.data.date = JSON.parse(localStorage.getNewDiagnosisData).date;
	                	} else {
                			var i = parseInt(Math.random()*19);
							res.data.date = new Date().getFullYear() + '-'
								+ (new Date().getMonth() > 8 ? '' : '0')
								+ (new Date().getMonth() + 1) + '-'
								+ (new Date().getDate() > 9 ? '' : '0')
								+ new Date().getDate();
	                	}
						res.data.result = $scope.result[i];
						res.data.symptom = $scope.symptom[i];
						res.data.memberInfo.age = '还小';
                		$scope.data = res.data;

                		localStorage.getNewDiagnosisData = JSON.stringify({
                			i: i, date: $scope.data.date
                		});

                		callback($scope.data);
	                });
				},

				// 图片、文字 转canvas
				convertImageToCanvas: function(data) {
					var canvas = document.createElement("canvas");
					canvas.width = data.bgImage.width;
					canvas.height = data.bgImage.height;
					var context = canvas.getContext("2d")
					context.drawImage(data.bgImage, 0, 0);
					context.drawImage(data.headImage, 474, 216, 200, 200);
					context.drawImage(data.qrCodeImage, 100, 880, 120, 120);

					context.font="33px HYQINGKONGTIJ";
					context.fillStyle = "#333";
					context.fillText(data.memberInfo.nickName, 196, 278);
					context.fillText(data.memberInfo.age, 196, 380);
					context.fillText(data.result, 264, 482);
					// 截取字符串 第一行缩进2字符 其他每行位置往下50px
					for (var i = 0; i <= data.symptom.length/10; i++) {
						var subSymptom = data.symptom.substr(
							[0, 16*i -2][Number(!!i)],  [14, 16][Number(!!i)]
						);
						context.fillText(subSymptom, [180, 110][Number(!!i)], 648 + 50*i);
					}
					context.fillText(data.date, 474, 1000);

					return canvas;
				},

				// canvas 转图片
				convertCanvasToImage: function(canvas) {
					$scope.diagnosisSrc = canvas.toDataURL('image/png');
					$scope.$digest();
				},

				// 提醒下载图片的modal
				remindModal: function(){
					$.modal({
						extraClass: 'remindModal',
						text: '<img src="/static/img/activity/getNew/guideDown.png">',
						buttons: [{
							text: '<img src="/static/img/activity/getNew/closeModal.png">'
						}]
					})
				},

				/*微信分享*/
				wxShare: function() {
					var shareTitle = "我被查出了" + $scope.data.result + "，你不来试试？",
						shareDesc = "美妆笑医室，专业拯救不开心，欢迎来测！还有精美化妆品拿哦~",
						shareImgUrl = $scope.data.memberInfo.headImgUrl,
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
