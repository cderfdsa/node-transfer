/* wxImage 			微信端图片插件
 * chooseImage 		拍照或选图
 * previewImage 	预览图片
 * uploadImage 		上传图片
 * downloadImage 	下载图片
 */
define(['app', 'wxjs'], function(app, wx) {

	var wxImageObj =  {
		/* 初始化 */
		init: function(opt) {
			wxImageObj.parames(opt);
			wxImageObj.wechatSign();
		},

		/* 合并参数 */
		parames: function(opt) {
			wxImageObj.options = $.extend({
				chooseImage: null, //拍照或从手机相册中选图接口
				previewImage: null, //预览图片接口
				uploadImage: null, //上传图片接口
				downloadImage: null //下载图片接口
			}, opt || {});
		},

		/* 获取签名 */
		wechatSign: function() {
			var self = wxImageObj;

			app.myApp.ajax({
				url: '/site/wechatSign',
				loading: false
			}, function(res) {
				if (!res.err) {
					wx.config({
						debug: false,
						appId: res.data.appId,
						timestamp: res.data.timestamp,
						nonceStr: res.data.nonceStr,
						signature: res.data.signature,
						jsApiList: [
							'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'scanQRCode'
						]
					});

					self.options.chooseImage && self.chooseImage(self.options.chooseImage);
					self.options.previewImage && self.previewImage(self.options.previewImage);
					self.options.uploadImage && self.uploadImage(self.options.uploadImage);
					self.options.downloadImage && self.downloadImage(self.options.downloadImage);
				} else $.toast(res.message);
			});
		},

		/* 拍照或从手机相册中选图接口 */
		chooseImage: function(chooseOpt) {
			var self = wxImageObj;
			wx.chooseImage({
				count: chooseOpt.count || 1, // 默认9
				sizeType: chooseOpt.sizeType || ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: chooseOpt.sourceType || ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
					chooseOpt.success && chooseOpt.success(localIds, self);
				}
			});
		},

		/* 预览图片接口 */
		previewImage: function(previewOpt) {
			wx.previewImage({
				current: previewOpt.current || '', // 当前显示图片的http链接
				urls: previewOpt.urls || [] // 需要预览的图片http链接列表
			});
		},

		/* 上传图片接口 */
		uploadImage: function(uploadOpt) {
			wx.uploadImage({
				localId: uploadOpt.localId[0] || '', // 需要上传的图片的本地ID，由chooseImage接口获得
				isShowProgressTips: uploadOpt.isShowProgressTips || 1, // 默认为1，显示进度提示
				success: function(res) {
					var serverId = res.serverId; // 返回图片的服务器端ID
					uploadOpt.success && uploadOpt.success(serverId);
				}
			});
		},

		/* 下载图片接口 */
		downloadImage: function(downloadOpt) {
			wx.downloadImage({
				serverId: downloadOpt.serverId || '', // 需要下载的图片的服务器端ID，由uploadImage接口获得
				isShowProgressTips: downloadOpt.isShowProgressTips || 1, // 默认为1，显示进度提示
				success: function(res) {
					var localId = res.localId; // 返回图片下载后的本地ID
					downloadOpt.success && downloadOpt.success(localId);

				}
			});
		}
	}

	$.wxImage = wxImageObj;

});