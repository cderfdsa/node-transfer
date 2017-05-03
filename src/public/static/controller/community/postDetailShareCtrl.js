/**分享的帖子详情-美妆商城                  控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'share'                sharejs
 * @param   {string} 'moment'               moment.js
 * @param   {string} 'pager'                pager.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 */

define(['app', 'angular', 'share', 'moment', 'cs!style', 'cs!smCss', 'pager', 'lazyLoad', 'smJs', '/common/directive/header/header.js', '/common/directive/wow/wow.js', 'cs!static/css/community/postDetailShare'], function(app, angular, share, moment) {

	/*定义 indexCtrl 控制器*/
	app.angular.controller('community/postDetailShareCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {

		$.extend($scope, {
			init: function() {
				this.staticScope();
				this.initAjax();
				this.sharecard();
			},

			/* 初始化静态 $scope */
			staticScope: function() {
				app.myApp.settitle($rootScope, '美妆—室友偷偷变美的秘密-美妆商城'); // 设置 title
				app.myApp.viewport("device");	// 设置viewport
				$scope.righttext = "···";
				$scope.domain = $domain;	// 设置 domain

				app.myApp.recordShare($http, 1, 1);	// 分享访问统计
			},

			/* 帖子详情接口 */
			initAjax: function() {
				var self = this;
				//用户信息接口
				app.myApp.ajax({
					url: '/account/userInfo',
				}, function(res) {
					if (!res.err) {
						$scope.userInfo = res.data;
						$scope.$digest();
					} else $.toast(res.errMsg)
				}),

				//帖子详情接口
				app.myApp.ajax({
					url: '/community/cardDetail',
					data: {
						id: $stateParams.id
					}
				}, function(res) {
					if (!res.err) {
						var time = moment().diff(moment(res.data.cardDetail.createdAt), "hours", true);
						if (time <= 1) {
							res.data.cardDetail.createdAt = "刚刚";
						} else if (time > 1 && time <= 24) {
							res.data.cardDetail.createdAt = parseInt(time) + "小时前";
						} else if (time > 24) {
							res.data.cardDetail.createdAt = moment(res.data.cardDetail.createdAt).format("YYYY-MM-DD");
						}
						res.data.cardDetail.commentNums = res.data.cardDetail.commentNums || 0;

						$scope.cardList = res.data;
						$scope.$digest();
					} else {
						$.toast("帖子不存在或已删除");
						setTimeout(function(){
							history.go(-1);
						},2000)
					}
				})

				// 访问分享页面
				if ($stateParams.shareKey) {
			    	if (app.myApp.iniValue.isLogin()) {	// 登录
				        app.myApp.http($http, {
				            url: '/member/share/visit',
				            defaultResErr: false,
				            data: {
				                shareKey: $stateParams.shareKey
				            }
				        }, function(){
				        	localStorage.removeItem('shareKey');
				        	localStorage.removeItem('shareKey_expire');
				        })
			    	} else {	// 未登录 储存sharekey 7天后过期
			    		localStorage.shareKey = $stateParams.shareKey;
			    		localStorage.shareKey_expire = new Date(new Date().getTime() + 7 * 24 * 3600 * 1000).getTime();
			    	}
			    }
			},

			/*分享帖子接口接口*/
			sharecard: function() {
				$.pager({
					$scope: $scope,
					lazyEle: '.lazy',
					scrollEle: '.content',
					pageSize:9,
					count:9,
					url: '/community/shareRecommendList',
					data: {
						limit: 9
					},
					callBack: function(res) {
						// moment转时间
						$(res.data).each(function(index, item) {
							item.time = moment().diff(moment(item.createdAt), "hours", true);
							if (item.time <= 1) {
								item.date = "刚刚";
							} else if (item.time > 1 && item.time <= 24) {
								item.date = parseInt(item.time) + "小时前";
							} else if (item.time > 24) {
								item.date = moment(item.createdAt).format("YYYY-MM-DD");
							}
						});
						if ($scope.data) $scope.data= $scope.data.concat(res.data);
						else $scope.data = res.data;
						$scope.$digest();
					}
				});
			},

			/* 初始化wow */
			initWow: function() {
				app.myApp.cnzz('wow');

				if (app.myApp.ifLogin() == false) return; // 未登录跳转去登陆

		        if ($scope.cardList.cardDetail.hasWow) { // wow过了提示
		          $.toast("你已经WOW过了哦~");
		          return;
		        }

				var wowValue = $scope.cardList.cardDetail.wowValue || 0;
				$.wow({
					success: function(index) {
						app.myApp.ajax({ // WOW
							url: '/community/cardWow',
							data: {
								wow: index, // wow值
								cardId: $stateParams.id // 帖子ID
							}
						}, function(res) {
							if (!res.err) {
								$scope.cardList.cardDetail.wowValue = wowValue + index;
								$scope.cardList.cardDetail.wow.count ++;
								$scope.cardList.cardDetail.wow.rows.unshift({
									memberId:$scope.userInfo.user.id,
									memberInfo:{
										headImg:$scope.userInfo.user.headImg
									}
								});
								$scope.cardList.cardDetail.hasWow = true;
								$scope.$digest();

								if (res.data.missionTip) $.completeTaskModal(res.data.missionTip);
								else $.toast("送wow成功~");

							} else $.toast(res.errMsg);
						});
					}
				});
			},
			Wow: function($index) {
				if (app.myApp.ifLogin() == false) return; // 未登录跳转去登陆

				if ($scope.data[$index].cardDetail.hasWow) { // wow过了提示
					$.toast("你已经WOW过了哦~");
					return;
				}

				var wowValue = $scope.data[$index].cardDetail.wowValue || 0;
				$.wow({
					success: function(index) {
						app.myApp.ajax({ // WOW
							url: '/community/cardWow',
							data: {
								wow: index, // wow值
								cardId: $scope.data[$index].cardDetail._id // 帖子ID
							}
						}, function(res) {
							if (!res.err) {
								$scope.data[$index].cardDetail.wowValue = wowValue + index;
								$scope.data[$index].cardDetail.wow.count++;
								$scope.data[$index].cardDetail.wow.rows.unshift({
									memberId: $scope.userInfo.user.id,
									memberInfo: {
										headImg: $scope.userInfo.user.headImg
									}
								});
								$scope.data[$index].cardDetail.hasWow = true;
								$scope.$digest();

								if (res.data.missionTip) $.completeTaskModal(res.data.missionTip);
								else $.toast("送wow成功~");

							} else $.toast(res.errMsg);
						});
					}
				});
			},


			/*head举报入口*/
			headRightFn: function() {
				if (app.myApp.ifLogin() == false) return; // 未登录跳转去登陆
				if ($scope.userInfo.user.adminLevel > 0 || $scope.cardList.cardDetail.isSelf == 1) {
					$.actions([
						[{
							text: '删除',
							onClick: function() {
								$scope.deleteBlank();
							}
						}],
						[{
							text: '取消'
						}]
					]);
				} else {
					$.actions([
						[{
							text: '举报',
							onClick: function() {
								app.myApp.ajax({
									url: '/community/cardReport',
									data: {
										cardId: $stateParams.id
									}
								}, function(res) {
									if (!res.err) {
										$.toast("举报成功")
										$scope.$digest();
									} else $.toast(res.errMsg)
								})
							}
						}],
						[{
							text: '取消'
						}]
					]);
				}
			},
			/*回调函数*/
			deleteBlank:function(){
				$.confirm("删除就追不回来了哦，确定要删除吗?",function(){
					app.myApp.ajax({
						url: '/community/cardDelete',
						data: {
							id: $stateParams.id
						}
					}, function(res) {
						if (!res.err) {
							$.toast("删除成功");
							history.back();
							$scope.$digest();
						} else $.toast(res.errMsg)
					})
				})
			},

			/* 跳转去wow列表 */
		     toWowList: function() {
		        location.hash = '#/community/wow/' + $scope.cardList.cardDetail._id;
		     },

			 /* 微信分享 */
			wxShare: function($index, type) {
				app.myApp.cnzz('cardShare');

				if (($scope.data[$index].cardDetail.isSelf || $scope.userInfo.user.adminLevel) && !type) { // 是否是管理员或者自己
					$scope.data[$index].cardDetail.moreAct = !$scope.data[$index].cardDetail.moreAct;
					return;
				}

				var contentText; // 取分享文字
				$($scope.data[$index].cardDetail.content).each(function(index, item) {
					if (item.type == 0) {
						contentText = item.data;
						return false;
					}
				});
				var shareTitle = "我通过任意门把美妆的时髦笔记分享给你",
					shareDesc = contentText || "点击更多惊喜哦~",
					shareImgUrl = "http://img.beautysite.cn" + $scope.cardList.cardDetail.image[0]+'!/fw/200',
					shareLink = location.href.replace("postPictureDetail", "postDetailShare"),
					callback = {
						success: function() {
							app.myApp.http($http, {
			                    url: '/member/card/share',
			                    data: {cardId: $scope.cardList.cardDetail._id}
			                }, function(res) {
			                    if (res.data.missionTip) $.completeTaskModal(res.data.missionTip);
			                    else $.toast("分享成功！");

			                    $(".wxfx").remove();
			                    app.myApp.recordShare($http, 0, 1);
			                });
						}
					};

				share.popupShare();
				share.setContent(shareTitle, shareDesc, shareImgUrl, shareLink, callback);

				$("body").delegate(".modal-overlay", "click", function() { // close tip modal
					$.closeModal();
				});
			},

			/*删除帖子*/
			delFn: function($index) {
				$.confirm('删除就追不回来了哦，确定要删除吗？', function() {
					app.myApp.ajax({
						url: '/community/cardDelete',
						data: {
							id: $scope.data[$index].cardDetail._id
						}
					}, function(res) {
						if (!res.err) {
							$scope.data[$index].cardDetail.isDelete = true;
							$scope.$digest();
							$.toast('删除成功！');
						} else $.toast(res.errMsg);
					});
				});
			},

			/*点击头像跳转用户首页*/
			downHome : function() {
				location.href = '#/community/home/' + $scope.cardList.cardDetail.memberId;
			},

			/* 粉TA */
		    fanFn: function() {
		    	var hasFollowed = $scope.cardList.cardDetail.hasFollowed;

		        if (!hasFollowed) app.myApp.cnzz('follow');

		        app.myApp.ajax({
		        	url: ['/community/followSave', '/community/followCancel'][Number(hasFollowed)],
		        	data: {parentId:$scope.cardList.cardDetail.memberId}
		        }, function(res) {
		        	if (!res.err) {
		            	$scope.cardList.cardDetail.hasFollowed = !$scope.cardList.cardDetail.hasFollowed;
		           		$scope.$digest();
		          	} else $.toast(res.errMsg);
		        });
            },

            /*帖子详情粉他*/
			fanFns: function($index) {
				var hasFollowed = $scope.data[$index].cardDetail.hasFollowed;

				if (!hasFollowed) app.myApp.cnzz('follow');

				app.myApp.ajax({
					url: ['/community/followSave', '/community/followCancel'][Number(hasFollowed)],
					data: {
						parentId: $scope.data[$index].cardDetail.memberId
					}
				}, function(res) {
					if (!res.err) {
						$scope.data[$index].cardDetail.hasFollowed = !$scope.data[$index].cardDetail.hasFollowed;
						$scope.$digest();
					} else $.toast(res.errMsg);
				});
			},

		    /*点击进入商品详情*/
		    togoods:function(item){
		    	location.href = '#/goods/detail/' + item.obj._id;
		    },
		    /*领取红包*/
		    receiveredBag:function(item){
		    	app.myApp.cnzz('cardBonus');

		    	$scope.url=item.obj._id;
		    	app.myApp.ajax({
		    		url:'/community/cardBonusReceive',
		    		data:{
		    			cardId:$scope.cardList.cardDetail._id,
		    			product:item.obj._id
		    		}
		    	},function(res){
		    		if(!res.err){
		    			var redPacketNo = res.data;
		    			$.modal({
				    		title:'<span>'+ "拔草红包已入账!" + '</span>',
				    		text:'<span>'+ redPacketNo +'</span>' + "元",
				    		extraClass:'receiveredBag',
				    		buttons:[
				    			{
				    			text:'<img src="/static/img/community/redBag_arrow.png">',
				    		},{
				    			text:'立即使用',
				    			onClick:function(){
				    				location.href ='#/goods/detail/' + $scope.url;
				    			}
				    		},{
				    			text:'红包当天有效呦~'
				    		}]
				    	})
		    		}else $.toast(res.errMsg);
		    	})
		    },

		    /*跳转到下载*/
		    toAppdownload:function(){
		    	location.href = 'http://wechat.beautysite.cn/h5/download'
			}

		}),

		$scope.init();

	}]);
});
