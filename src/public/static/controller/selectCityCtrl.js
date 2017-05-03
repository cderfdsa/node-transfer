/**选择城市    控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!../css/selectCity' selectCity.css
 */
define(['app', 'angular', 'BMap', 'jQuery', 'cs!../css/style', 'cs!../css/selectCity'], function(app, angular) {

    /*定义 selectCityCtrl 控制器*/
    app.angular.controller('selectCityCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
        /*设置标题*/
        app.myApp.settitle($rootScope, '选择城市');

        /*初始化页面数据*/
        $http.get($ajaxDomain + '/site/GetCityList').success(function(res){
        	if (res.err == 0) {
        		$scope.data = res.data;
        		$scope.firstLetterArr = [];
        		for (var i = 0; i < $scope.data.length; i++) {
        			if ($scope.firstLetterArr.indexOf($scope.data[i].firstLetter) == -1)
        				$scope.firstLetterArr.push($scope.data[i].firstLetter);
        		}
            } else {
              alert(res.message);
            }
        }).error(function(){
        	alert("访问接口出错");
        });

        /*地图定位*/
        $scope.locate = {
        	"name": "定位中···",
        	"class": "s_bkd"
        }
        var geolocation = new BMap.Geolocation();
	    geolocation.getCurrentPosition(function(r){
	        if(this.getStatus() == BMAP_STATUS_SUCCESS){
	        	$.get($ajaxDomain + '/site/cityInfo', {'lat':r.point.lat, 'lng':r.point.lng}, function(res){
	                if (res.err == 0) {
	                	$scope.locate.name =res.data.name;
	                	$scope.locateUrl = '#/selectSchool/' + res.data.id;
	                	$scope.locate.class = "";
	                	$scope.$digest();
	                } else {
	                	$scope.locate.name = "定位失败";
	                	$scope.$digest();
	                }
	            }, 'json');
	        } else {
	        	$scope.locate.name = "定位失败";
	        	$scope.$digest();
	        }
	    }, {enableHighAccuracy: true});

        /*手动设置城市列表高度*/
    	$(".s_city, .s_dw, .s_searchCon").height($(window).height() - 163);

    	/*城市列表滚动交互*/
        $scope.JumpCityFn = function($event, $index){
        	$scope.aIndex = $index;
            scrollFun($index, 'click');
        }
        
        $("#s_dcvv").on("touchmove", function(e){
            e.preventDefault();
            var y = e.originalEvent.targetTouches[0].pageY - $("#s_dcvv").offset().top;
            var n = parseInt(y / 28);
            $scope.aIndex = n;
            $scope.$digest();
            scrollFun(n);
        });

        $(".s_city").scroll(function(){
        	$(this).find(".s_dwzm").map(function(){
        		if ($(this).offset().top <= 163)
        		$scope.aIndex = $(this).parent().index() - 4;
            	$scope.$digest();
        	});
            $scope.$digest();
        });

        function scrollFun(ind, type){
	        ht = $("#s_dcvv").find("a").eq(ind).html();
	        var top = $(".s_dwzm[con='"+ht+"']").offset().top,
	        	scrollTopNum = $(".s_city").scrollTop() + top - 163;
	        if (type == "click")
	        	$(".s_city").animate({scrollTop: scrollTopNum}, 200);
	        else
	        	$(".s_city").scrollTop(scrollTopNum);
	    }

        /*搜索城市*/
        var last;
        $scope.searchFn = function(){
            $("#s_rm:hidden").fadeIn();
            $('.s_cancelSearch').show();
            var values = $.trim($scope.searchName),
                res='';
            if (!values) {
                $("#s_rm, .s_cancelSearch, .s_searchCon").fadeOut();
                return;
            }
            setTimeout(function(){
                if (last == values) searchCity(values);
            }, 100);
            last = values;
        }

        function searchCity(values){
            var values = values.toLowerCase();
            $scope.searchNameFn = function(item){
            	var reg = new RegExp(values);
            	return reg.test(item.name) || reg.test(item.pinyin);
            }
            $scope.$digest();
            $(".s_searchCon:hidden").show();
        }

        /*取消搜索*/
        $scope.searchClose = function(){
            $("#s_search").val("");
            $("#s_rm, .s_cancelSearch, .s_searchCon").fadeOut();
        }
    }]);
});