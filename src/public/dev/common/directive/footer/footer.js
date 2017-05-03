define(['app', 'wxImage', 'cs!./footer'], function(app) {
	app.angular.directive('foot', function() {
		return {
			restrict: 'E',
			template: '<nav class="bar bar-tab footer {{footers[2].active}}" ng-if="footerForm">' +
				'<a ng-repeat="footer in footers" class="tab-item {{footer.active}}" href="{{footer.link}}" ng-click="footerLinkFn($event, $index)">' +
				'<span class="icon"></span>' +
				'<span class="tab-label">{{footer.text}}</span>' +
				'</a>' +
				'</nav>',
			replace: true,
			controller: function($scope, $element) {
				// 当 url 为 document.domain/?form=app/#/xxx 时（在app中），隐藏尾部
				$scope.footerForm = $.getParam("from") != 'app';

				$scope.footers = [{
					link: '#/home',
					text: '首页',
					active: 'active'
				}, {
					link: '#/goods',
					text: '爆款购',
					active: ''
				}, {
					link: '#/community/list/0',
					text: '女神说',
					active: ''
				}, {
					link: '#/order/cart',
					text: '购物车',
					active: ''
				}, {
					link: '#/userCenter',
					text: '我的',
					active: ''
				}];

				var mark = location.hash.split("/")[1]; // home goods community shopcar userCenter

				$($scope.footers).each(function(index, item) {
					if (item.link.indexOf(mark) > -1) item.active = 'active';
					else item.active = '';
				});

				$scope.footerLinkFn = function($event, $index) { // 点击 menu 的回调
					if ($index == 2 && $scope.footers[2].active == 'active') { // 在社区页点击社区
						$event.preventDefault();

						if (app.myApp.ifLogin(location.hash) == false) return;	// 	未登录先去登录

						if (!$.getWxSign) $.wxImage.init();	// 先请求微信签名，减少点击PO图等待时间
						$.getWxSign = true;

						document.addEventListener('DOMNodeInserted', function() { // 监测dom append modal
							if ($(".modal-rotateMenu")[0] && !$(".modal-rotateMenu .animate")[0]) {
								setTimeout(function() {
									$(".modal-buttons").addClass("animate");
								}, 200);
							}
						}, false);

						$.modal({
							extraClass: 'modal-rotateMenu',
							buttons: [{
								text: '<img src="/common/directive/footer/modal-rotateMenu-btn0.png">',
								close: false,
								onClick: function() {
									$(".modal-buttons").removeClass("animate");
									setTimeout(function() {
										$.closeModal();
									}, 1000);
								}
							}, {
								text: '<img src="/common/directive/footer/modal-rotateMenu-btn1.png">' +
								'<input type="file" class="bUploadBtn '+ (app.myApp.iniValue.isWeiXin && 'hide') +'" onchange="$.upload()">',
								close: false,
								onClick: function() {
									// H5引导去APP发帖
									// downloadModal();
									// return;
									if (app.myApp.iniValue.isWeiXin) {
										$.closeModal();
										wxChooseImage();
									}
								}
							}, {
								text: '<img src="/common/directive/footer/modal-rotateMenu-btn2.png">',
								onClick: function() {
									// if ($scope.userInfo.user.level < 4 && !$scope.userInfo.user.seniorMember) applyAmb();
									// else {
										// H5引导去APP发帖
										// downloadModal();
										// return;
										location.href = '#/community/note';
									// }
								}
							}]
						});
					}


					// 限制购物车/个人中心登录
					if ($index == 3 || $index == 4) {
						$event.preventDefault();
                        var hash = $scope.footers[$index].link;

                        if (app.myApp.ifLogin(hash) == false) return;

                        location.hash = hash;
					}
				}

				/*发帖弹出下载页*/
	            var downloadModal = function() {
	                $.modal({
	                    text: '<img src="/static/img/community/modal-appDownload.png">',
	                    extraClass: 'modal-appDownload',
	                    buttons: [{
	                        text: '<img src="/static/img/community/modal-appDownload-close.png">'
	                    }, {
	                        text: '<img src="/static/img/community/modal-appDownload-btn0.png">'
	                    }, {
	                        text: '<img src="/static/img/community/modal-appDownload-btn1.png">',
	                        onClick: function() {
	                            location.href = 'http://wechat.beautysite.cn/h5/download';
	                        }
	                    }]
	                });
	            }

				var wxChooseImage = function() {
					$.wxImage.chooseImage({ // 选择图片
						sizeType: ['compressed'], // 缩略图
						success: function(localIds, self) {

							self.uploadImage({ // 上传图片
								localId: localIds, // 图片的本地ID
								success: function(serverId) {
									app.myApp.ajax({ // 上传到服务器并获得回调地址
										url: '/community/uploadImg',
										data: {
											remotePath: '/community', // 目录(社区为/community)
											type: 0, // 类型(可选，不填则不限制宽高比，0：po帖图片)
											mediaId: serverId // 微信media id
										}
									}, function(res) {
										if (!res.err) {
											localStorage.postPicture_viewImgUrl = res.data;
											$scope.$digest();
											location.href = '#/community/postPicture';
										} else $.toast(res.errMsg);
									});
								}
							});

						}
					});
				}

				/* 浏览器上传文件 */
				$.upload = function(){
					var formData = new FormData();
	         			formData.append("file", $(".bUploadBtn")[0].files[0]);
	         			formData.append("remotePath", '/community');
					$.closeModal();
			        app.myApp.ajax({
				        url: "/account/uploadImg",
				        data: formData,
				        processData: false,
				        contentType: false
	        		}, function(res) {
				        if (!res.err) {
		                    localStorage.postPicture_viewImgUrl = res.data.img;
							$scope.$digest();
							location.href = '#/community/postPicture';
				        } else $.toast(res.errMsg);
				    });
				}

				var applyAmb = function() { // 申请开通大使弹窗
					$.modal({
						text: '<img src="/common/directive/footer/modal-applyAmb.png">',
						extraClass: 'modal-applyAmb',
						buttons: [{
							text: '<img src="/common/directive/footer/modal-applyAmb-close.png">'
						}, {
							text: '<img src="/common/directive/footer/modal-applyAmb-btn0.png">'
						}, {
							text: '<img src="/common/directive/footer/modal-applyAmb-btn1.png">',
							onClick: function() {
								location.href = '#/userCenter/level/0';
							}
						}]
					});
				}

			}
		};
	});
});
