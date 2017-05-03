/* fileUpload 		浏览器/微信端图片插件
 * chooseImage 		拍照或选图（仅限微信）

 */
define(['app', 'wxImage'], function(app) {

	var fileUpload =  {
		/* 初始化 */
		init: function(opt) {
			var self = fileUpload;

			self.parames(opt);			// 合并参数

			self.createDOM($(this));	// 添加DOM

			self.bindEvent($(this));			// 绑定dom事件

			if (self.isWeiXin)			// wxImage初始化
				$.wxImage.init();
			
			return self;
		},

		isWeiXin: function(){
			return app.myApp.iniValue.isWeiXin;
		},

		/* 合并参数 */
		parames: function(opt) {
			this.options = $.extend({
				imageFrom: null, //拍照或从手机相册中选图接口
				text: '',
	            remotePath: '',
	            wxUrl: '',
	            bwUrl: '',
	            actions: false,
	            callback: ''
			}, opt || {});
		},

		createDOM: function($this){
			var html = this.options.text +
		        	(this.isWeiXin() ? '' : '<input type="file" class="uploadFileInput">');
		    $this.append(html);

		    if (!/relative|absulote|fixed/g.test($this.css("positon"))) {
		    	$this.css('position', 'relative');
		    	$this.find(".uploadFileInput").css({
		    		'width': '100%',
		    		'height': '100%',
		    		'position': 'absolute',
		    		'top': 0,
		    		'left': 0,
		    		'z-index': 15,
		    		'opacity': 0
		    	});
		    }

		},

		/* 获取签名 */
		/* 微信上传图片 */
		wxImage: function(imageFrom) {
			var _this = this;

	        $.wxImage.chooseImage({ // 选择图片
	          	sizeType: ['compressed'], // 缩略图
	          	sourceType: imageFrom || ['album', 'camera'], // 相册/相机
	          	success: function(localIds, self) {

		            self.uploadImage({ // 上传图片
		              localId: localIds, // 图片的本地ID
		              success: function(serverId) {
		                app.myApp.ajax({ // 上传到服务器并获得回调地址
		                  url: _this.options.wxUrl || '/community/uploadImg',
		                  data: {
		                    remotePath: _this.remotePath, // 目录
		                    mediaId: serverId // 微信media id
		                  }
		                }, function(res) {
		                  if (!res.err) {
		                    _this.options.callback && _this.options.callback(res);
		                  } else $.toast(res.errMsg);
		                });

		              }
		            });

	          	}
	        });
		},

		/* 浏览器上传文件 */
		upload: function($this){
			var self = this;

			var formData = new FormData();
         		formData.append("file", $this[0].files[0]);
         		formData.append("remotePath", self.remotePath);
	        app.myApp.ajax({
		        url: self.options.bwUrl || "/account/uploadImg",
		        data: formData, 
		        processData: false,  
		        contentType: false 
        		}, function(res) {
		        if (!res.err) {
                    self.options.callback && self.options.callback(res);
		        } else $.toast(res.errMsg);
		    });
		},

		bindEvent: function($this) {
			var  self = this;

			$this.on("click", function(){
				if (self.isWeiXin()) {
					if (self.options.actions) {
						$.actions([
							[{
					            text: '拍照',
					            onClick: function() {
					              	self.wxImage(['camera']);
					            }
					        }, {
					            text: '从相册选择',
					            onClick: function() {
					              	self.wxImage(['album']);
					            }
					        }],
							[{
								text: '取消'
							}]
						]);

					} else self.wxImage();
				}
			});

			$this.find(".uploadFileInput").on("change", function(){
				self.upload($(this));
			});
		}	
	}

	$.fn.fileUpload = fileUpload.init;

});