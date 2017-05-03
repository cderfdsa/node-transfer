/**申请提现    控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/style'         style.css
 */
define(['app', 'angular', 'cs!css/style'], function(app, angular) {

    /*定义 applyWithdrawalsCtrl 控制器*/
    app.angular.controller('applyWithdrawalsCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
        /*设置标题*/
        app.myApp.settitle($rootScope, '申请提现');

        /*跳转链接*/
        $scope.linkUrl = function($event){
            location.href = $event.target.getAttribute("href");
        };

        /*输入密码*/
        var val;
		$(".l_cda").find("input").on("input",function(){
			val=$(this).val();
			$(".l_inputStyle_3").find("input").val("");
			for(var i=0;i<val.length;i++){
				$(".l_inputStyle_3").eq(i).find("input").val(val.substr(i,1));
			}
		});
    }]);
});
