/* Zepto 增加 extend 方法 */
define(['app', 'cs!address'], function(app) {
	$.fn.address = function(opt) {
		var ele = this;
		return new address($.extend({
			ele: ele
		}, opt || {}));
	}

	/* 构造函数 */
	var address = function(opt) {
		this.parames(opt);
		this.tabEvent();
	}

	/* 原型链方法 */
	address.prototype = {
		/* 合并参数 */
		parames: function(opt) {
			this.options = $.extend({
				data: [{
					title: '省',
					list: '/site/province',
                    http: false,			// AJAX 是否用 $http
                    method: 'POST',			// AJAX 请求方式
                    limitData: {},
                    data: ''
				}, {
					title: '市',
					list: '/site/getCityList',
                    http: false,
                    method: 'POST',
                    limitData: {},
                    data: 'provId'
				}, {
					title: '学校',
					list: '/site/schoolList',
                    http: false,
                    method: 'POST',
                    limitData: {},
                    data: 'cityId'
				}],
				callback: null
			}, opt || {});
		},

		/* ajax请求数据 */
		ajax: function(url, data, type, http){
			var self = this;

			if (!http) {
				app.myApp.ajax({
					loading: false,
					url: url,
					type: type,
					data: data || {}
				}, function(res) {
					if (!res.err) {
						var contentHTML = '';
						$(res.data).each(function(index, item){
							contentHTML += '<li class="' + (index == 0 && 'active') + '" data-id="' + item.id + '">' + item.name + '</li>';
						});
						$(".address_popup_content").html(contentHTML);
					} else $.toast(res.errMsg);
				})
			} else {
				app.myApp.http(http, {
                    loading: false,
					url: url,
					method: type,
					data: data || {}
                }, function(res){
                    var contentHTML = '';
					$(res.data).each(function(index, item){
						contentHTML += '<li class="' + (index == 0 && 'active') + '" data-id="' + item.id + '">' + item.name + '</li>';
					});
					$(".address_popup_content").html(contentHTML);
                });
			}
		},

		/* 组装HTML */
		popupHTML: function(index){
			var titleHTML = '', contentHTML = '';
			$(this.options.data).each(function(index, item){
				titleHTML += '<span data-title="' + item.title + '" class="pull-left ' + (index == 0 && 'active') + '">' + item.title + '</span>';
				contentHTML += '';
			});
			var popupHTML = '<div class="popup address_popup">'+
				'<div class="address_popup_title clearfix">' +
					titleHTML +
				'</div>' +
				'<ul class="address_popup_content">' +
					contentHTML +
				'</ul>' +
			'</div>';
			return popupHTML;
		},

		/* 切换效果 */
		switchTab: function(self, index){
			$(self).addClass("active").siblings().removeClass("active");

			if (index < 2) {
				$(".address_popup_title .active").removeClass("active")
					.text($(self).text());
				$(".address_popup_title span").eq(index + 1).addClass("active")
					.attr("data-id", $(self).data("id"));
			} else {
				// 省市区保存
				$(this.options.ele).val($(self).text()).attr("data-id", $(self).data("id"));
				this.options.callback && this.options.callback(self);
				$.closeModal();
			}
		},

		/* 点击事件 */
		tabEvent: function(){
			var self = this;

			$(this.options.ele).prop("readonly", "true");

			$(this.options.ele).on("click", function(){	// open popup
				$.popup(self.popupHTML(0));
				self.ajax(
					self.options.data[0].list,
					$.extend(self.options.data[0].limitData || {}, self.options.data[0].data || {}),
					self.options.data[0].method,
					self.options.data[0].http
				);
				$("body").off("click", ".modal-overlay-visible");
				$("body").on("click", ".modal-overlay-visible", function(){
					if ($(".address_popup_title .active").index() == 0) $.closeModal();
				});
			});

			$("body").off("click", ".address_popup_title span");
			$("body").on("click", ".address_popup_title span", function(){	// click popup list
				var activeIndex = $(".address_popup_title .active").index();
				if ($(this).index() < activeIndex) {
					var id = $(this).data("id"),
						index = $(this).index();
					var data = {};
					if (index == 1) data[self.options.data[1].data] = id;
					self.switchTab(this, index -1);
					for (var i = 1; i >= index; i--) {
						var $ele = $(".address_popup_title span").eq(i);
						$ele.text($ele.data("title"));
					}
					self.ajax(
						self.options.data[index].list,
						$.extend(self.options.data[index].limitData || {}, data || {}),
						self.options.data[index].method,
						self.options.data[index].http);
				} else $.toast("请先选择" + self.options.data[activeIndex].title);
			});

			$("body").off("click", ".address_popup_content li");
			$("body").on("click", ".address_popup_content li", function(){	// click popup list
				var index = $(".address_popup_title .active").index();
				self.switchTab(this, index);
				if (index < 2) {
					var id = $(this).data("id");
					var data = {};
					data[self.options.data[index + 1].data] = id;
					self.ajax(
						self.options.data[index + 1].list,
						$.extend(self.options.data[index + 1].limitData || {}, data || {}),
						self.options.data[index + 1].method,
						self.options.data[index + 1].http
					);
				}
			});

		}
	}

});
