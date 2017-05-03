/**
 * [移动端拖拽插件]
 * @param  {[type]} window [description]
 * @return {[type]}        [description]
 */
;(function($) {
	var drag = {
		init: function(obj) {
			var self = drag;

			self.opt = $.extend({
				touchstart: null, 	// touchstart 回调
				touchmove: null, 	// touchmove 回调
				touchend: null, 	// touchend 回调
				move: true			// 随着 touchmove 移动位置
			}, obj || {});

			self.ele = $(this);
			self.disX = 0;
			self.disY = 0;

			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) mobile = true;
            else mobile = false;

			self.ele.on("touchstart mousedown", function(e) {
				var e = e || event;
				e.preventDefault();
				if (mobile) e = e.touches[0];
                else e = e;
				self.touchStart(e);
			});
		},

		touchStart: function(e) {
			// this指针
			var self = drag;
			self.opt.touchstart && self.opt.touchstart(e);
			self.disX = e.clientX - self.ele[0].offsetLeft;
			self.disY = e.clientY - self.ele[0].offsetTop;
			self.ele.off("touchmove mousemove touchend mouseup");
			self.ele.on("touchmove mousemove", function(e) {
				var e = e || window.event;
				self.touchMove(e);
			});
			self.ele.on("touchend mouseup", function() {
				self.touchEnd();
			});
		},

		touchMove: function(e) {
			var self = drag;

			self.opt.touchmove && self.opt.touchmove(e);
			
			if (self.opt.move) {
				self.ele[0].style.left = (e.clientX - self.disX) + 'px';
				self.ele[0].style.top = (e.clientY - self.disY) + 'px';
			}
		},

		touchEnd: function() {
			var self = this;
			self.opt.touchEnd && self.opt.touchEnd();
		}
	};

	$.extend($.fn, {drag: drag.init});
})(Zepto);