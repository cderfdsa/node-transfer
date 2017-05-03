/**个人信息-美妆商城    					控制器 依赖JS CSS
 * @param   {string} 'app'                 	app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'fileUpload'           fileUpload.js
 * @param   {string} 'address'              address.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'moment'               moment.js
 * @param   {string} 'wxjs'               	wx.js
 */

define([
	'app',
	'angular',
	'moment',
	'wxjs',
	'fileUpload',
	'address',
	'cs!style',
	'cs!smCss',
	'smJs',
	'/common/directive/header/header.js',
	'cs!static/css/userCenter/userInfo'
], function(app, angular, moment, wx) {

	/*定义 userInfoCtrl 控制器*/
	app.angular.controller('userCenter/userInfoCtrl', [
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
				this.initAddress();
				this.calendar();
				this.initUploadFile();
				this.bindEvent();
			},

			/* 初始化静态 $scope */
			staticScope: function() {
				app.myApp.settitle($rootScope, '个人信息-美妆商城'); // 设置 title
				app.myApp.viewport("device"); // 设置viewport
			},

			/* 初始化动态数据 */
			initAjax: function() {
				var self = this;
				app.myApp.ajax({ // 用户信息
					url: '/account/userInfo'
				}, function(res) {
					if (!res.err) {
						if (localStorage.userInfo_userInfo)
							self.storageToScope();
						else {
							$scope.userInfo = res.data; //有数据 不显示    没数据 显示 true
							var mobile = $scope.userInfo.user.mobile;
							if (mobile) $scope.userInfo.user.mobile = mobile.replace(mobile.substring(3, 7), "****");
							$scope.userInfo.user.birthday = $scope.userInfo.user.birthday && moment($scope.userInfo.user.birthday).format('YYYY-MM-DD');
							$scope.userInfo.user.schoolYear = moment($scope.userInfo.user.schoolYear).format('YYYY') + "年";
						}

						if ($scope.userInfo.user.hasOwnProperty("seniorMember")) {
							$scope.barcode = false;
						} else {
							$scope.barcode = true;
						}

						$("#my-input").calendar({ // 生日
							value: [$scope.userInfo.user.birthday || '1995-01-01']
						});
						$scope.$digest();
					} else $.toast(res.errMsg)
				});
			},

			/* 选择地址 */
			initAddress: function(){
				$("#selectSchool").address({callback: function(self){
					$scope.userInfo.user.city = $(".address_popup_title span").eq(2).data("id");
					$scope.userInfo.user.school = $("#selectSchool").data("id");
				}});
			},

			/* init uploadFile */
			initUploadFile: function(){
				$(".imgBox").fileUpload({
					remotePath: '/userInfo',
					callback: $scope.saveUserHeadImg,
					actions: true
				});
			},

			saveUserHeadImg: function(res){	// 上传头像
				var img = app.myApp.iniValue.isWeiXin ? res.data : res.data.img;
				$scope.userInfo.user.headImg = 'http://img.beautysite.cn' + img;
				$scope.$digest();

				app.myApp.ajax({
					url: '/account/saveUserHeadimg',
					data: {
						headImg: img
					}
				}, function(res) {
					if (!res.err) {
						$.toast("上传成功~");
					} else $.toast(res.errMsg);
				});
			},

			calendar: function() {
				$scope.startYear = []
				for (var i = 1997; i < 2016; i++) {
					$scope.startYear.push(i + "年");
				};
			},

			/* popup: type:0昵称 1宣言 */
			popup: function(classStr, type){
				$scope.popupObj = [{
					title: "设置昵称",
					label: "昵称",
					defaultValue: ''
				}, {
					title: "美丽宣言",
					defaultValue: "要变美，要发光，耶~",
				}]
				$scope.modalClass = classStr;
				$scope.inputModel = type == 0 ? $scope.userInfo.user.nickName : ($scope.userInfo.user.signature || $scope.popupObj[type].defaultValue);

				$scope.type = type;
			},

			popupSubmit: function(){
				if (!$.trim($scope.inputModel)) {
					$.toast(($scope.type == 0 ? "昵称" : "宣言") + "不能为空哦~");
					return;
				}
				if(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test($scope.inputModel)) {
					$.toast(($scope.type == 0 ? "昵称" : "宣言") + "不能含有表情哦~");
					return;
				}

				if ($scope.type) $scope.userInfo.user.signature = $scope.inputModel;
				else $scope.userInfo.user.nickName = $scope.inputModel;
				$scope.popup('modal-out');
			},

			clear: function(){
				$scope.inputModel = '';
			},

			/* 跳转前保存信息 */
			scopeToStorage: function(){
				if ($scope.userInfo.user.schoolInfo) $scope.userInfo.user.schoolInfo.name = $("#selectSchool").val();
				localStorage.userInfo_userInfo = JSON.stringify($scope.userInfo);
			},

			/* localStorage to scope */
			storageToScope: function(){
				$scope.userInfo = JSON.parse(localStorage.userInfo_userInfo);
				localStorage.removeItem("userInfo_userInfo");
			},

			/*选择性别*/
			toSex:function(){
				$.actions([
		            [{
		              text: '男',
		              onClick: function() {
		               	$scope.userInfo.user.sex = 1;
		                $scope.$digest();
		              }
		            },
		            {
		              text: '女',
		              onClick: function() {
		               	$scope.userInfo.user.sex = 2;
		                $scope.$digest();
		              }
		            }
		            ],
		            [{
		              text: '取消'
		            }]
		          ]);
			},

			/*保存信息*/
			saveUserInfo: function(type) {
				if (!$scope.userInfo.user.headImg) {
					$.toast("头像还木有上传哦~");
					return;
				} else if (!$scope.userInfo.user.nickName) {
					$.toast("请输入昵称");
					return;
				} else if (!$scope.userInfo.user.birthday) {
					$.toast("请选择生日");
					return;
				}else if (!$scope.userInfo.user.sex) {
					$.toast("请选择性别");
					return;
				} else if (!$scope.userInfo.user.schoolYear) {
					$.toast("请选择入学年份");
					return;
				} else if (!$scope.userInfo.user.city) {
					$.toast("请选择所在城市");
					return;
				} else if (!$scope.userInfo.user.school) {
					$.toast("请选择所在学校");
					return;
				}

				if (status) return;
				var status = true;

				app.myApp.ajax({
					url: '/account/saveUserInfo',
					data: {
						nickname: $scope.userInfo.user.nickName,
						birthday: $scope.userInfo.user.birthday,
						entrance: $scope.userInfo.user.schoolYear,
						city: $scope.userInfo.user.city,
						school: $scope.userInfo.user.school,
						signature: $scope.userInfo.user.signature || '要变美，要发光，耶~',
						sex: $scope.userInfo.user.sex
					}
				}, function(res) {
					status = false;
					if (!res.err) {
						if (res.data.missionTip)
							$.completeTaskModal(res.data.missionTip);
						else
							$.toast("保存成功");

						setTimeout(function() {
							location.href = '#/userCenter'
						}, 1000);
						$scope.$digest();
					} else $.toast(res.errMsg);
				});

			},

			/*服务大使扫一扫*/
			sweep: function() {
				wx.scanQRCode({
					needResult: 1,
					scanType: ["qrCode"],
					success: function(res) {
						var result = res.resultStr;
						var _result = result.split('#'),
							_code = _result[1];
						app.myApp.ajax({
							url: '/account/bindAmbassador',
							data: {
								'code': _code
							}
						}, function(res) {
							if (!res.err) {
								$.toast("绑定成功")
							} else $.toast(res.errMsg)
						})
					}
				})
			},

			/*绑定大使*/
			binding: function() {
				var reg = /^1\d{10}$/;
				if (!reg.test($scope.bindMobile)) {
					$.toast("请输入正确的大使手机号码");
					return;
				} else if (!$scope.bindMobile) {
					$.toast("请输入大使的手机号码");
					return;
				} else {
					app.myApp.ajax({
						url: '/account/bindAmbassadorMobile',
						data: {
							mobile: $scope.bindMobile
						}
					}, function(res) {
						if (!res.err) {
							$.toast("绑定成功");
						} else $.toast(res.errMsg)
					})
				}
			},

			bindEvent: function() {
				var self = this;

				/*跳转手机绑定页面*/
				$scope.skipPhone = function() {
					self.scopeToStorage();
					$rootScope.mobile = $scope.userInfo.user.mobile;
					$(".pink").css('color', '#F44386');
					location.href = '#/userCenter/login/bindPhone';
				}

				/*跳转收货地址页面*/
				$scope.skipAddress = function(eve) {
					self.scopeToStorage();
					$(".change").css('color', '#F44386');
					location.href = '#/userCenter/address';
				}

				$scope.callphone = function() {
					$(".input").css("color", " #FF6699");
				}
			}
		});

		$scope.init();
	}]);
});