/**商品分类    控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/style'         style.css
 */
define(['app', 'angular', 'cs!css/style'], function(app, angular) {

    /*定义 goodsClassifyCtrl 控制器*/
    app.angular.controller('goodsClassifyCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
        /*设置标题*/
        app.myApp.settitle($rootScope, '商品分类');

        /*跳转链接*/
        $scope.linkUrl = function($event){
            location.href = $event.target.getAttribute("href");
        };

        /*page*/
        $(".s_flx").height($(window).height() - 163);
        $(".s_leftSc").find(".s_cv").click(function(){
			$(this).addClass("act").siblings(".s_cv").removeClass("act");
			$(".s_rightPro").find(".s_list").eq($(this).index()).show().siblings(".s_list").hide();
		});
    }]);
});
