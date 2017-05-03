/**
 * 1. 在 js 中引入指令： '/common/directive/wow/wow.js'
 * 2. html 中 初始化：<wow wow-texts="['推荐','最新','关注']" tab-active="0" callback="alert()"></wow>
 * 	wow-texts 	文字
 * 		 wow-active 初始tab的index
 *    	 callback 	自定义回调函数
 */

define(['app', 'drag', 'cs!./wow'], function(app) {
	var wow = {
		/* 初始化 */
		init: function(obj) {
			var self = wow;
			self.parames(obj);
			self.modal();
			self.drawCanvas();
			self.bindSlideEvent();
		},

		/* 合并参数 */
		parames: function(obj) {
			var self = wow;
			self.opt = $.extend({
				success: null
			}, obj || {});
		},

		/* 初始化 modal */
		modal: function() {
			var self = wow;

			$.modal({
				extraClass: 'wow-modal',
				title: '<img id="title" src="/common/directive/wow/info0.png" alt="">',
				text: '<div class="wow-content">' +
					'<img class="wow_guide" src="/common/directive/wow/wow_guide.png" alt="">' +
					'<canvas id="canvas">当前浏览器不支持Canvas，请更换浏览器后再试</canvas>' +
					'<img id="bowknot" src="/common/directive/wow/bowknot0.png" alt="">' +
					'<img class="expression" src="/common/directive/wow/expression0.png" alt="">' +
					'<img class="mouth" src="/common/directive/wow/mouth0.png" alt="">' +
					'</div>',
				afterText: '<div><img class="value" src="/common/directive/wow/value0.png" alt=""><img class="no" src="/common/directive/wow/0.png" alt=""></div>' +
					'<div class="modal-button"><img id="modalBtn" src="/common/directive/wow/button0.png" alt=""></div>'
			});
			
			$("body").off("click", ".wow-modal .modal-button img");
			$("body").on("click", ".wow-modal .modal-button img", function(e){
				if (!!self.index) $.closeModal();
				else return;
				self.opt.success && self.opt.success(self.index);
			});
			
			$("body").off("click", ".modal-overlay, .wow-modal");
			$("body").on("click", ".modal-overlay, .wow-modal", function(e){
				$.closeModal();
			});
		},

		// 绘制图形
		drawCanvas: function() {
			var self = wow;
			var canvas = $("#canvas")[0];
			canvas.width = 220; // 设置长宽和内部精度
			canvas.height = 220;

			if (canvas.getContext('2d')) { //判断浏览器是否支持canvas
				self.context = canvas.getContext('2d'); // 设置上下文环境，使用context进行绘制

				self.drawOuterCircle();
				self.drawProgress(0.1);
			} else {
				alert("当前浏览器不支持Canvas，请更换浏览器后再试");
			}
		},

		// 画一个灰色的圆弧
		drawOuterCircle: function() {
			var self = wow;
			self.context.clearRect(0, 0, 220, 220); // 将绘图区域清空

			self.context.moveTo(110, 110); // 坐标移动到圆心
			self.context.beginPath();
			self.context.arc(110, 110, 106, 0, Math.PI * 2, false); // 画圆,110,110,半径110,从角度0开始,画到2PI结束,最后一个参数是方向顺时针还是逆时针
			self.context.lineWidth = 8;
			self.context.closePath();
			self.context.strokeStyle="#c9c9c9";
			self.context.stroke();
		},

		// 画进度
		drawProgress: function(angle) {
			var self = wow;

			if (angle >= 1) {
				self.context.beginPath();
				self.context.moveTo(110, 110);
				self.context.arc(110, 110, 106, Math.PI * 1.5, Math.PI * 2 * (angle - 90) / 360, false); // 画扇形
				self.context.lineWidth = 8;
				self.context.closePath();
				self.context.strokeStyle="#ff688c";
				self.context.stroke();

				self.drawSpace(angle);
			}
		},

		// 画内部填充
		drawSpace: function(angle) {
			var self = wow,
				color;

			if (angle >= 1) {
				color = '#fffb7b';

				self.context.moveTo(110, 110);
				self.context.beginPath();
				self.context.arc(110, 110, 102, 0, Math.PI * 2, true);
				self.context.closePath();
				self.context.fillStyle = color;
				self.context.fill();
			}
		},

		// 绑定旋转滑动事件
		bindSlideEvent: function() {
			var self = wow;
			var _td_init_deg = -1;  // 第一次拖动
			var rotateStatus;
			$('#bowknot').drag({
				touchstart: function(e) {
					$(".wow_guide").remove();
					// rotateStatus = 0;
				},
				touchmove: function(e) {
					$ele = $(".wow-content");
					var offset = $ele.offset();
                    var center = {
                        y: offset.top + $ele.height() / 2,
                        x: offset.left + $ele.width() / 2
                    };

                    var a, b, deg, angle, rad2deg = 180 / Math.PI;

                    if (mobile) move = e.touches[0];
                    else move = e;

                    a = center.y - move.pageY;
                    b = center.x - move.pageX;
                    deg = Math.atan2(a, b) * rad2deg;


                    if (deg < 0) deg = 360 + deg;

                    if (_td_init_deg == -1) _td_init_deg = deg;
                    angle = deg - _td_init_deg + 1;

                    if (angle < 0) angle = 360 + angle;

					if (rotateStatus && b < 0) return;
					else rotateStatus = 0;

                    if (angle >= 355) {
                    	rotateStatus = 1;
                    	angle = 359.5;
                    }

					e.target.style.transform = 'translateX(-50%) rotate(' + angle + 'deg)'
					e.target.style.webkitTransform = 'translateX(-50%) rotate(' + angle + 'deg)';

					self.drawOuterCircle();
					self.drawProgress(angle);

					if (0 <= angle && angle < 1) self.index = 0;
					if (1 <= angle && angle < 90) self.index = 1;
					if (90 <= angle && angle < 180) self.index = 2;
					if (180 <= angle && angle < 270) self.index = 3;
					if (270 <= angle && angle < 359) self.index = 4;
					if (angle >= 359) self.index = 5;

					$("#bowknot").prop("src", "/common/directive/wow/bowknot" + (self.index == 0 ? self.index : 1) + ".png");
					$("#title").prop("src", "/common/directive/wow/info" + self.index + ".png");
					$(".expression").prop("src", "/common/directive/wow/expression" + (self.index == 0 ? self.index : 1) + ".png");
					$(".mouth").prop("src", "/common/directive/wow/mouth" + (self.index == 0 ? self.index : 1) + ".png").css("width", 26 + angle / 360 * 60);
					$(".value").prop("src", "/common/directive/wow/value" + (self.index == 0 ? self.index : 1) + ".png");
					$(".no").prop("src", "/common/directive/wow/" + self.index + ".png");
					$("#modalBtn").prop("src", "/common/directive/wow/button" + (self.index == 0 ? self.index : 1) + ".png");
					if (self.index >= 5) $(".wow-modal .modal-inner").addClass("perfect");
					else $(".wow-modal .modal-inner").removeClass("perfect");
				},
				move: false
			});
		}
	};

	$.wow = wow.init;

});