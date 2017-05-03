/**购物车   控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'lazyLoad'             lazyLoad.js
 * @param   {string} 'touch'                touch.min.js
 */
define([
    'app',
    'angular',
    'cs!style',
    'cs!smCss',
    'smJs',
    'lazyLoad',
    'touch',
    '/common/directive/header/header.js',
    '/common/directive/footer/footer.js',
    'cs!static/css/order/cart'
    ], function(app, angular) {

    /*定义 order/cartCtrl 控制器*/
    app.angular.controller('order/cartCtrl', [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$http',
        function($rootScope, $scope, $state, $stateParams, $http) {

        $.extend($scope, {
            init: function() {
                this.staticScope();
                this.initAjax();
            },

            /* 初始化静态 $scope */
            staticScope: function() {
                app.myApp.settitle($rootScope, '购物车-美妆商城'); // 设置 title
                app.myApp.viewport("device"); // 设置viewport

                if (app.myApp.ifLogin(location.hash, '#/home') == false) return;
            },

            /* 初始化动态数据 */
            initAjax: function() {
                var self = this;

                app.myApp.ajax({ // 商品列表和热品列表
                    url: '/goods/cart'
                }, function(res) {
                    if (!res.err) {
                        // 积分兑换/赠品倒计时
                        $(res.data.cart).each(function(index, item){
                            if (item.expireDate) $scope.countDown(item);
                        });

                        $scope.data = res.data;
                        $scope.checkedAll = !$scope.data.cart.length;
                        $scope.checkedFn(1);
                        $scope.cartNone = !$scope.data.cart.length;

                        $scope.hideRight = !$scope.data.cart.length; // header rightBtn 显隐
                        $scope.btnText = !$scope.data.cart.length ? '' : '编辑'; // header rightBtn 文字

                        $scope.$digest();
                        $(".lazy").lazyLoad();
                        $scope.swipeAction();
                    } else $.toast(res.errMsg);
                });
            },

            /* 兑吧商品详情链接 */
            linkGoodsUri: function(productId, type){
                if (type == 1) {
                    app.myApp.http($http, {
                        url: '/member/product/integral/' + productId + '/detail',
                        method: 'GET'
                    }, function(res){
                        location.href = res.data.duibaUrl;
                    });
                } else
                    location.hash = '#/goods/detail/' + productId;
            },

            /* 积分兑换/赠品倒计时 */
			countDown: function(item){
				var endTime = item.expireDate - new Date().getTime();
				if (endTime < 0) return;	// 过期直接显示0
				var interval = setInterval(function(){
					item.day = parseInt(endTime/(24*60*60*1000));	// 天
					item.hh = parseInt(endTime%(24*60*60*1000)/(60*60*1000));	// 时
                    item.mm = parseInt(endTime%(60*60*1000)/(60*1000)); // 分
                    item.ss = parseInt(endTime%(60*1000)/1000); // 秒
                    if (item.hh < 10) item.hh = '0' + item.hh;
                    if (item.mm < 10) item.mm = '0' + item.mm;
                    if (item.ss < 10) item.ss = '0' + item.ss;
					$scope.$digest();
					if (endTime <= 0) clearInterval(interval);
					endTime -= 1000;
				}, 1000);
			},

            /*邮费popup*/
            popup: function(type) {
                $scope.popupClass = type == 'close' ? 'slideDown' : 'slideUp';
            },

            /*button显隐*/
            showEditBtn: function() {
                $scope.showEdit = !$scope.showEdit;
                $scope.btnText = ['编辑', '完成'][Number($scope.showEdit)];
            },

            /* checkbox 选择框交互 type: 0单选 1全选 */
            checkedFn: function(type, $index) {
                $scope.qty = 0;
                $scope.totalMoney = 0;
                if (type) { // 全选
                    $scope.checkedAll = !$scope.checkedAll;
                    $($scope.data.cart).each(function(index, item) {
                        item.checked = $scope.checkedAll;
                        if ($scope.checkedAll) {
                            $scope.qty += item.qty;
                            $scope.totalMoney += item.type ? 0 : item.qty * item.price;
                        }
                    });
                } else { // 单选
                    $scope.checkTrueLength = 0;
                    $($scope.data.cart).each(function(index, item) {
                        if (item.checked) {
                            $scope.checkTrueLength++;
                            $scope.qty += item.qty;
                            $scope.totalMoney += item.type ? 0 : item.qty * item.price;

                        }
                    });

                    $scope.checkedAll = $scope.checkTrueLength == $scope.data.cart.length;
                }

            },

            /*减少*/
            cut: function($index) {
                if ($scope.data.cart[$index].qty == 1) {
                    $scope.delFn($index);
                    return;
                }
                $scope.data.cart[$index].qty--;
                $scope.checkedFn(0);
            },

            /*增加*/
            add: function($index) {
                $scope.addFn($index);
            },

            /* 左滑 */
            swipeAction: function(){
                $("li").on("swipeLeft", function(e){
                    $(this).find(".listBox").css("margin-left", "-7rem");
                });

                $("li").on("swipeRight", function(e){
                    $(this).find(".listBox").css("margin-left", "0");
                })
            },

            //删除(单个、批量)、收藏(批量和单个)成功的回调函数
            deleteSuccessCallback: function(type, $index) {
                if (type) {
                    $($scope.data.cart).each(function(index, item) {
                        if (item.checked) {
                            item.isDelete = true;
                            item.checked = false;
                        }
                    });
                } else {
                    $scope.data.cart[$index].isDelete = true;
                    $scope.data.cart[$index].checked = false;
                }

                // 刷新总价、总数
                $scope.checkedFn(0);
                // 显隐购物车为空页面
                $scope.cartNone = true;
                $($scope.data.cart).each(function(index, item) {
                    item.isDelete || ($scope.cartNone = false);
                });
                if ($scope.cartNone) $scope.btnText = '';
            },

            // 收藏(批量和单个)
            collectFn: function($index) {
                var data, canCollect = true;
                if ($index == undefined) {
                    var products = [];
                    $($scope.data.cart).each(function(index, item) {
                        // 兑换商品和赠品无法移入收藏夹
                        if (item.type) {
                            $.toast('赠品/兑换商品不能移入收藏夹');
                            canCollect = false;
                        }
                        if (item.checked) {
                            products.push(item.product);
                        }
                    });
                    if (!canCollect) return;
                    data = {
                        products: products.join()
                    };
                } else {
                    // 兑换商品和赠品无法移入收藏夹
                    if ($scope.data.cart[$index].type) {
                        $.toast('该商品不能移入收藏夹');
                        return;
                    }
                    data = {
                        products: $scope.data.cart[$index].product
                    };
                }

                app.myApp.ajax({
                    url: '/goods/multiCollect',
                    data: data,
                }, function(res) {
                    if (!res.err) {
                        //从购物车删除选中的商品 功能已做好待确认
                        // $scope.deleteSuccessCallback($index == undefined, $index);
                        // $scope.$digest();
                        $.toast('加入收藏夹成功！');
                    } else $.toast(res.errMsg);
                })
            },

            /* 增加单个商品 */
            addFn: function($index) {
                app.myApp.ajax({
                    url: "/goods/addCart",
                    data: {
                        proid: $scope.data.cart[$index].product,
                        standardId: $scope.data.cart[$index].standard,
                        qty: $scope.data.cart[$index].qty
                    },
                    loading: false
                }, function(res) {
                    if (!res.err) {
                        $scope.data.cart[$index].qty++;
                        $scope.checkedFn(0);
                        $scope.$digest();
                    } else $.toast(res.errMsg);
                });
            },

            /*
             * 删除商品
             * $index 存在 单个删除，否则为批量删除
             */
            delFn: function($index) {
                var data, deleteN;
                if ($index == undefined) {
                    var dataArr = [], canDelete = true;
                    $($scope.data.cart).each(function(index, item) {
                        // 兑换商品和赠品无法删除
                        if (item.type) {
                            $.toast('赠品/兑换商品不能删除');
                            canDelete = false;
                        }

                        if (item.checked) {
                            var obj = {
                                product: item.product, //商品id
                                standard: item.standard //规格id
                            }
                            dataArr.push(obj);
                        }
                    });
                    if (!canDelete) return;
                    data = {
                        products: dataArr
                    };
                    deleteN = true;
                } else {
                    // 兑换商品和赠品无法删除
                    if ($scope.data.cart[$index].type) {
                        $.toast('该商品不能删除');
                        return;
                    }
                    data = {
                        'cartId': $scope.data.cart[$index]._id
                    };
                    deleteN = false;
                }
                $.confirm('确定删除' + (deleteN ? '选中' : '该') + '商品吗?', function() {
                    app.myApp.ajax({
                        url: deleteN ? "/goods/multiDelCart" : "/goods/delCart",
                        data: data,
                        loading: false
                    }, function(res) {
                        if (!res.err) {
                            $scope.deleteSuccessCallback(deleteN, $index);
                            $scope.$digest();
                        } else $.toast(res.errMsg);
                    });
                });
            },

            /* 去结算 */
            settlementFn: function() {
                app.myApp.cnzz('cartBuy');

                if (!$scope.qty) {
                    $.toast('请勾选商品');
                    return;
                }
                var orderProducts = [];
                $($scope.data.cart).each(function(index, item) {
                    if (item.checked && !item.isDelete) {
                        orderProducts.push({
                            'cartId': item._id,         // 购物车id
                            'product': item.product,    // 商品id
                            'standard': item.standard,  // 规格id
                            'qty': item.qty             // 数量
                        });
                    }
                });

                $.toast('结算中...');

                app.myApp.http($http, { // 下单前检查
                    url: '/member/order/check',
                    data: {
                        orderProducts: orderProducts,
                        isCart: true
                    },
                    loading: false
                }, function(res){
                    localStorage.orderConfirmProducts = JSON.stringify(res.data);
                    location.href = '#/order/confirm/1';
                });
            }
        });

        $scope.init();
    }]);
});