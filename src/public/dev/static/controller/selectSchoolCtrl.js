/**选择学校    控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/style'         style.css
 * @param   {string} 'cs!css/selectSchool'  selectSchool.css
 */
define(['app', 'angular', 'cs!../css/style', 'cs!../css/selectSchool', 'jQuery'], function(app, angular) {

    /*定义 selectSchoolCtrl 控制器*/
    app.angular.controller('selectSchoolCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
        /*设置标题*/
        app.myApp.settitle($rootScope, '选择学校');

        /*初始化页面数据*/
        $.get($ajaxDomain + '/site/schoolList', {cityId: $stateParams.cityId}, function(res){
        	if (res.err == 0) {
        		$scope.data = res.data;
        		$scope.$digest();
            } else {
              alert(res.message);
            }
        }, 'json');

        /*手动设置城市列表高度*/
    	$(".s_searchCon").height($(window).height() - 163);

        /*搜索城市*/
        $scope.searchFn = function(){
            $("#s_rm:hidden").fadeIn();
            $('.s_cancelSearch').show();
            var values = $.trim($scope.searchName),
                res='';
            if (!values) {
                $("#s_rm, .s_cancelSearch, .s_searchCon").fadeOut();
                return;
            }
            $(".s_searchCon:hidden").show();
        }

        /*取消搜索*/
        $scope.searchClose = function(){
            $("#s_search").val("");
            $("#s_rm, .s_cancelSearch, .s_searchCon").fadeOut();
        }
    }]);
});
