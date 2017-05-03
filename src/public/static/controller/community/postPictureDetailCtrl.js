/**po图/发帖详情-美妆商城                   控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'share'                sharejs
 * @param   {string} 'moment'               moment.js
 * @param   {string} 'pager'                pager.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 */

define([
	'app',
	'angular',
	'share',
	'moment',
	'cs!style',
	'cs!smCss',
	'pager',
	'lazyLoad',
	'smJs',
	'/common/directive/header/header.js',
	'/common/directive/wow/wow.js',
	'cs!static/css/community/postPictureDetail'
], function(app, angular, share, moment) {

	/*定义 indexCtrl 控制器*/
	app.angular.controller('community/postPictureDetailCtrl', [
		'$rootScope',
		'$scope',
		'$state',
		'$stateParams',
		'$http',
		'$element',
		function($rootScope, $scope, $state, $stateParams, $http, $element) {

		$.extend($scope, {
			init: function() {
				this.staticScope();
				this.initAjax();
				this.getcardComment();
				this.clickBlank();
			},

			/* 初始化静态 $scope */
			staticScope: function() {
				app.myApp.settitle($rootScope, '详情-美妆商城'); // 设置 title
				app.myApp.viewport("device");	// 设置viewport
				$scope.righttext = "···";
				$scope.domain = $domain;	// 设置 domain
				$scope.showComment = true;
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
                        },2000);
					}
				})

				// 获取分享KEY
				app.myApp.http($http, {
			      	url: '/member/senior/share'
			    }, function(res){
			      	$scope.shareKey = res.data;
			    });
			},

			/*评论接口*/
			getcardComment: function() {
				$.pager({
					$scope: $scope,
					lazyEle: '.lazy',
					scrollEle: '.content',
					url: '/community/cardCommentList',
					data: {
						pageSize: 10,
						cardId: $stateParams.id
					},
					callBack: function(res) {
						// moment转时间
						$(res.data.rows).each(function(index, item) {
							item.time = moment().diff(moment(item.createdAt), "hours", true);
							if (item.time <= 1) {
								item.date = "刚刚";
							} else if (item.time > 1 && item.time <= 24) {
								item.date = parseInt(item.time) + "小时前";
							} else if (item.time > 24) {
								item.date = moment(item.createdAt).format("YYYY-MM-DD");
							}
						});

						if ($scope.data) $scope.data.rows = $scope.data.rows.concat(res.data.rows);
						else $scope.data = res.data;
						$scope.$digest();
					}
				});
			},

			/*评论点赞接口*/
			cardCommentLike:function(item){
				var item = item;
				if(item.isLiked){
					app.myApp.ajax({
						url:'/community/cardCommentLikeCancel',
						data:{
							commentId:item._id,
						}
					},function(res){
						if(!res.err){
							$.toast("取消点赞");
							item.isLiked = false;
							item.likeNums = item.likeNums-1
							$scope.$digest();
						}else $.toast(res.errMsg)
					});
				}else{
					app.myApp.ajax({
						url:'/community/cardCommentLike',
						data:{
							commentId:item._id,
						}
					},function(res){
						if(!res.err){
							$.toast("点赞成功");
							item.isLiked = true;
							item.likeNums = item.likeNums+1
							$scope.$digest();
						} else $.toast(res.errMsg)
					})
				}
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

			/*点击空白处操作*/
			clickBlank:function(){
				$(".content").click(function(event){
					if($(event.target).is(".inputBox")|| $(event.target).is(".comment") || $(event.target).is(".comment_none")  ){
						$scope.showComment = false;
					}else {
						$scope.showComment = true;
					}
					$scope.$digest();
				})
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

			/*微信分享*/
			wxShare: function() {
				app.myApp.cnzz('cardShare');

				var contentText;  // 取分享文字s
		        $($scope.cardList.cardDetail.content).each(function(index, item){
		          if (item.type == 0) {
		            contentText = item.data;
		            return false;
		          }
		        });
				var shareTitle = "我通过任意门把美妆的时髦笔记分享给你",
					shareDesc = contentText || "点击更多惊喜哦~",
					shareImgUrl = "http://img.beautysite.cn" + $scope.cardList.cardDetail.image[0]+'!/fw/200',
					shareLink = location.href.replace('postPictureDetail', 'postDetailShare') + '?shareKey=' + $scope.shareKey,
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

				share.setContent(shareTitle, shareDesc, shareImgUrl, shareLink, callback);
				share.popupShare();
			},
			/*点击回复评论*/
			commentCard:function(index,item, type, $event) { //isSelf = 1  自己的评论  isSelf=0 别人的评论
				$event.stopPropagation();
				$scope.item = item;
				if (item.isSelf == 1) {
					$scope.showComment = true;
					$.actions([
						[{
							text: '删除',
							onClick: function() {
								app.myApp.ajax({
									url: '/community/cardCommentDelete',
									data: {
										id: item._id
									}
								}, function(res) {
									if (!res.err) {
										$scope.data.rows.splice(index,1);
										$scope.data.count=$scope.data.count-1;
										$scope.cardList.cardDetail.commentNums=$scope.cardList.cardDetail.commentNums-1;
										$scope.$digest();
									} else $.toast(res.errMsg)
								})
							}
						}],
						[{
							text: '取消'
						}]
					]);
				} else {
					$scope.itemname = item.member.nickName;
						$scope.showComment = false;
						$scope.type = 1;
				}
			},

			/*点击回复主贴*/
			comment : function(type) {
				if (app.myApp.ifLogin() == false) return; // 未登录跳转去登陆
				$scope.itemname = "";
				$scope.showComment = false;
				$scope.type = 0;
			},

			/*点击发送提交*/
			submit : function(type) { //type=0 评论主贴  type=1 回复评论
				app.myApp.cnzz('comment');

				if(!$scope.commentText)return;
				app.myApp.ajax({
					url: '/community/cardCommentSave',
					data: {
						cardId: $scope.cardList.cardDetail._id,
						type: $scope.type,
						content: $scope.commentText,
						sourceId: type ? $scope.item.memberId : undefined
					}
				}, function(res) {
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
					if (!res.err) {
						if (res.data.missionTip) $.completeTaskModal(res.data.missionTip);

						$scope.data.rows.unshift(res.data);
						$scope.data.count = $scope.data.count + 1;
						$scope.cardList.cardDetail.commentNums ++;
						$scope.showComment = true;
						$scope.commentText = "";
						$scope.$digest();
					} else $.toast(res.errMsg);
				})
			},

			/*输入input改变css*/
			disabled : function(){
				if($scope.commentText.length){
					$scope.disabled = 'default'
				}
			},

			/*点击头像跳转用户首页*/
			downHome : function() {
				location.href = '#/community/home/' + $scope.cardList.cardDetail.memberId;
			},

			/*评论列表点击头像跳转用户首页*/
			toHome : function(item) {
				location.href = '#/community/home/' + item.memberId;
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
				    			text:'红包当天有效呦~',
				    			onClick:function(){
				    				location.href ='#/goods/detail/' + $scope.url;
				    			}
				    		}]
				    	})
		    		}else $.toast(res.errMsg);
		    	})
		    }
		}),

		$scope.init();

	}]);
});
