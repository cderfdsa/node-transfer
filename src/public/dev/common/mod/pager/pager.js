/* pager 移动端滚动分页加载插件
 *
 */
define(['app', 'touch', 'cs!pager'], function(app) {

/* Zepto 绑定 pager */
$.pager = function(opt){
	pagerObj.init(opt);
}

var pagerObj = {
	/*初始化*/
	init: function(opt) {
		this.parames(opt);
		this.ajaxLoad();
		this.scrollEvent();
	},

	/*合并参数*/
	parames: function(opt) {
		this.options = $.extend({
			$scope: null,	//传入$scope
			lazyEle: '',	//是否懒加载，若是，需要引入lazyLoad.js，此处传入css选择器
			scrollEle: '',	//滚动的容器，传入css选择器
			repeatEle: 'li',//循环的元素，传入css选择器
			page: 0,		//当前页码, 默认从0开始
			pageSize: 10,	//每页数量(默认10)
			url: '',		//ajax请求数据地址
			data: {},		//ajax入参
			repeatArr: null,//循环的数组，默认是res.data.rows
			http: false,	// 是否用angular 自带 http 方式获取数据
			method: 'POST',	// http method
			count: null,	//数据总条数，默认是res.data.count
			callBack: null	//ajax请求成功的回调函数
		}, opt || {});

		this.load = false;		//是否正在加载
		$loadAllELe = $('<div class="loadAll">已经到底啦~</div>');
		$swipLoad = $('<div class="swipLoad">下拉加载更多...</div>');
		this.options.$scope.data = null;	//fix bug：when swith url
		this.count = 0;
	},

	/*ajax 请求*/
	ajaxLoad: function(){
		var self = this,
			url = self.options.url,
			data = $.extend(self.options.data, {page: self.options.page, pageSize: self.options.pageSize}),
			sucback = function(res){
				if (self.options.callBack) {
					self.options.callBack(res);
				} else {
                	if (self.options.$scope.data) {
						if (self.options.repeatArr) self.options.$scope[self.options.repeatArr] = self.options.$scope[self.options.repeatArr].concat(res[self.options.repeatArr]);
                		else self.options.$scope.data.rows = self.options.$scope.data.rows.concat(res.data.rows);
                	}
                	else self.options.$scope.data = res.data;
					!self.options.http && self.options.$scope && self.options.$scope.$digest();
				}

				// 懒加载
				setTimeout(function(){
					self.options.lazyEle && $(self.options.lazyEle).lazyLoad();
				})
          		// 加载的条数
          		self.repeatArr = res[self.options.repeatArr] || res.data.rows;
          		self.count += self.repeatArr.length;
          		//是否全部加载
          		self.options.count = self.options.count || res.data.count;
				self.loadAll = self.options.count ? self.count >= (self.options.count) : 'none';

				$(".swipLoad").remove();

				if (self.loadAll == 'none') return;
				else if (self.loadAll) $(self.options.scrollEle).append($loadAllELe);
				else $(self.options.scrollEle).append($swipLoad);

				self.options.page ++;
			};

		if (self.options.http) {
			app.myApp.http(self.options.http,{
                url: url,
                method: self.options.method,
                data: data,
                defaultResErr: false                 
            },function(res){
            	if (!res.err) {
					sucback(res);
				} else $.toast(res.errMsg);
                setTimeout(function(){
	                self.load = false;
	            }, 500);
            })
		} else {
			app.myApp.ajax({
				url: url,
				data: data
			}, function(res) {
				if (!res.err) {
					sucback(res);
				} else $.toast(res.errMsg);

				setTimeout(function(){
	                self.load = false;
	            }, 500);
			})
		}
	},

	/*滚动*/
	scrollEvent: function(){
		var self = this;
		self.options.$scope.$watch("data", function(newVal, oldVal){
			if (newVal != oldVal) {
			    setTimeout(function(){
					$(self.options.scrollEle).swipeUp(function() {
			            if (self.loadAll) return;

			          	if ($(self.options.repeatEle).last().offset().top - $(window).height() < 0) {
			            	if (self.load) return;
			            	self.load = true;
			            	self.ajaxLoad();
			          	}

				    });
	            }, 200);
        	}
    	});
	}
}
});
