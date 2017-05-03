/**编辑收货地址-美妆商城    				控制器 依赖JS CSS
 * @param   {string} 'app'                 	app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'address'              address.js
 */

define([
	'app',
	'angular',
	'cs!style',
	'cs!smCss',
	'smJs',
    'address',
	'/common/directive/header/header.js',
    '/common/directive/tab/tab.js',
	'cs!static/css/userCenter/addressEdit'
], function(app, angular) {

	/* define userCenter/addressEditCtrl controller */
    app.angular.controller('userCenter/addressEditCtrl', [
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
                this.initAddress();
            },

            /* initialize static $scope */
            staticScope: function() {
                app.myApp.settitle($rootScope, '收货地址-美妆商城'); // set title
                app.myApp.viewport("device"); // set viewport
                $scope.type = 1;   // 0校内 1校外
                $scope.id = $stateParams.id || '';   // 地址id
            },

            /* get initialize data */
            initAjax: function() {
                if ($scope.id) {
                    app.myApp.http($http, { // 收货地址详情
                        url: '/member/address/' + $scope.id + '/detail',
                        method: 'GET'
                    }, function(res){
                        $scope.linkman = res.data.linkman;
                        $scope.mobile = res.data.mobile;
                        $scope.cityId = res.data.cityId;
                        if ($scope.type == res.data.type) { // 切换后地址为空
                            $scope.address = res.data.address;
                            $("#isDefault")[0].checked = eval(res.data.isDefault);
                            $("#selectAddress").val(res.data.addressStr);
                        }

                        if ($scope.type == 0) { // 校内编辑地址
                             $scope.schoolId = res.data.schoolId;
                             $scope.dormitoryId = res.data.dormitoryId;
                        } else { // 校外编辑地址
                             $scope.provinceId = res.data.provinceId;
                             $scope.areaId = res.data.areaId;
                        }
                    });
                }
            },

            /* tab callback*/
            tabFn: function(index){
                $('#selectAddress').off("click").val('');
                localStorage.addressType = index;
                $scope.address = '';
                $scope.cityId = '';
                $scope.schoolId = '';
                $scope.dormitoryId = '';
                $scope.provinceId = '';
                $scope.areaId = '';
                $("#isDefault")[0].checked = false;
                $scope.staticScope();
                $scope.initAjax();
                $scope.initAddress();
            },

            /* initialize plugin address */
            initAddress: function(){
                if ($scope.type == 0) {   // 校内
                    $("#selectAddress").address({
                        data: [{
                            title: '城市',
                            list: '/city/list',
                            http: $http,
                            method: 'GET',
                            limitData: {open: true}
                        }, {
                            title: '大学',
                            list: '/school/list',
                            http: $http,
                            method: 'GET',
                            limitData: {status: 1},
                            data: 'city'
                        }, {
                            title: '宿舍楼',
                            list: '/dormitory/list',
                            http: $http,
                            method: 'GET',
                            data: 'school',
                            limitData: {}
                        }],
                        callback: function(self){
                            $scope.cityId = $(".address_popup_title span").eq(1).data("id");
                            $scope.schoolId = $(".address_popup_title span").eq(2).data("id");
                            $scope.dormitoryId = $("#selectAddress").data("id");
                            $("#selectAddress").val(
                                $(".address_popup_title span").eq(0).text() + '市 ' +
                                $(".address_popup_title span").eq(1).text() + ' ' +
                                $("#selectAddress").val()
                            )
                        }
                    });
                } else {
                    $("#selectAddress").address({
                        data: [{
                            title: '省',
                            list: '/province/list',
                            http: $http,
                            method: 'GET'
                        }, {
                            title: '市',
                            list: '/city/list',
                            http: $http,
                            method: 'GET',
                            data: 'provinceId'
                        }, {
                            title: '区域',
                            list: '/area/list',
                            http: $http,
                            method: 'GET',
                            data: 'cityId',
                            limitData: {}
                        }],
                        callback: function(self){
                            $scope.provinceId = $(".address_popup_title span").eq(1).data("id");
                            $scope.cityId = $(".address_popup_title span").eq(2).data("id");
                            $scope.areaId = $("#selectAddress").data("id");
                            $("#selectAddress").val(
                                $(".address_popup_title span").eq(0).text() + '省 ' +
                                $(".address_popup_title span").eq(1).text() + '市 ' +
                                $("#selectAddress").val()
                            )
                        }
                    });
                }
            },

            /* save address */
            submit: function(){
                if (!$scope.linkman) {
                    $.toast('请填写正确的收货人');
                    return;
                }
                if (!/^0?1[3|4|5|7|8][0-9]\d{8}$/g.test($scope.mobile)) {
                    $.toast('请填写正确的联系方式');
                    return;
                }
                if ($scope.type == 1 && !$scope.provinceId) {
                    $.toast('请选择省份');
                    return;
                }
                if (!$scope.cityId) {
                    $.toast('请选择城市');
                    return;
                }
                if ($scope.type == 1 && !$scope.areaId) {
                    $.toast('请选择所在地区');
                    return;
                }
                if ($scope.type == 0 && !$scope.schoolId) {
                    $.toast('请选择学校');
                    return;
                }
                if ($scope.type == 0 && !$scope.dormitoryId) {
                    $.toast('请选择宿舍楼');
                    return;
                }
                if (!$scope.address) {
                    $.toast(['寝室不能为空', '请填写详细地址'][$scope.type]);
                    return;
                }

                app.myApp.http($http, { // 保存/更新收货地址
                    url: ['/member/address/save', '/member/address/' + $scope.id + '/update'][Number(!!$scope.id)],
                    data: $.extend([{
                            schoolId: $scope.schoolId,      // 学校 id
                            dormitoryId: $scope.dormitoryId // 宿舍 id
                        }, {
                            provinceId: $scope.provinceId,  // 省份 id
                            areaId: $scope.areaId           // 区域 id
                        }][$scope.type], {
                        cityId: $scope.cityId,          // 城市 id
                        address: $scope.address,        // 地址或者房号（必填）
                        type: $scope.type,              // 类型（0:校内 1:校外）
                        mobile: $scope.mobile,          // 手机号(必填)
                        linkman: $scope.linkman,        // 联系人(必填)
                        isDefault: $("#isDefault")[0].checked.toString()// 是否默认地址(必填)
                    })
                }, function(res){
                    $.toast("地址"+['保存', '更改'][Number(!!$scope.id)]+"成功！");
                    localStorage.removeItem('addressType');
                    history.back();
                });
            },

            back: function(){
                localStorage.removeItem('addressType');
                history.back();
            }

		});

		$scope.init();
	}]);
});
