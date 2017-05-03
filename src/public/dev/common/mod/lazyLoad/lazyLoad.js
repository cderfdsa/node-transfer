/**
 * lazyLoad 图片懒加载
 */
;(function($) {

	var lazyLoad = {
		/* init */
		init: function(){
			var self = lazyLoad,
				_this = this,
				direction = -1;	// 滚动方向
			
			self.bodyHeight = document.body.offsetHeight;	//body（页面）可见区域的总高度

			self.setDomStyle(_this);	// 重新组装html和style

			self.changeSrc(_this);	// 首屏加载
			
			$(".content").scroll(function(){	// 滚动加载
				var scrollHeight = self.scrollHeight();

				if (direction <= scrollHeight) {
					direction = scrollHeight;
					self.changeSrc(_this);
				}
			});
		},

		/* 页面滚动 DOM scrollTop 值 */
		scrollHeight: function(){
			return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || $(".content").scrollTop() || 0;
		},

		/* set dom & style */
		setDomStyle: function(ele){
			$(ele).css({	// 监听渐显动画
				'transition': 'opacity .5s',
				'-webkit-transition': 'opacity .5s'
			});
		},

		/* 将 data-src 设置为 src */
		changeSrc: function(ele){
			var self = this;

			ele.map(function(index, item){
				if ($(item).offset().top < self.bodyHeight*2) {
					var img = new Image(); 
			       	img.src = $(item).attr("lazySrc");
				}
				if (!$(item).hasClass('lazyLoaded') && $(item).offset().top < self.bodyHeight) {
					$(item).css("opacity", 0).addClass('lazyLoaded');
					setTimeout(function(){
						$(item).prop("src", $(item).attr("lazySrc"))
						$(item).css("opacity", 1);
					}, 200);
				}
			});
		}
	};

	$.extend($.fn, {lazyLoad: lazyLoad.init});
})(Zepto);