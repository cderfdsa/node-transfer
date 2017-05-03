/**设置提现账号    控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/style'         style.css
 */
define(['app', 'angular', 'jQuery', 'layerJs', 'cs!css/style'], function(app, angular, $, layer) {

    /*定义 setWithdrawalsAccountCtrl 控制器*/
    app.angular.controller('setWithdrawalsAccountCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
        /*设置标题*/
        app.myApp.settitle($rootScope, '设置提现账号');

        /*跳转链接*/
        $scope.linkUrl = function($event){
            location.href = $event.target.getAttribute("href");
        };

        /*验证 重新写*/
		function yz(){
			if ($("#txtName").val() == "") {
				layerFun("请输入您的真实姓名!");
				$("#txtName").focus();
				return false;
			}	
			if ($("#card").val() == "") {
				layerFun("请输入您的18位身份证号码!");
				$("#card").focus();
				return false;
			}
			
			if(isNaN($("#card").val()) || ($.trim($("#card").val())).length != 18){
				layerFun("您的18位身份证号码格式不对!");
				$("#card").focus();
				return false;
			}
			
			if ($("#aliplayCount").val() == "") {
				layerFun("请输入您的支付宝账号!");
				$("#aliplayCount").focus();
				return false;
			}
			if ($("#password").val() == "") {
				layerFun("请输入6位数字提现密码!");
				$("#password").focus();
				return false;
			}
			if (isNaN($("#password").val()) || ($.trim($("#password").val())).length != 6) {
				layerFun("请输入6位数字提现密码!");
				$("#password").focus();
				return false;
			}
			
			if ($("#SurePassword").val() == "") {
				layerFun("请确认6位数字提现密码!");
				$("#SurePassword").focus();
				return false;
			}
			if (isNaN($("#SurePassword").val()) || ($.trim($("#SurePassword").val())).length != 6) {
				layerFun("请输入6位数字提现密码!");
				$("#SurePassword").focus();
				return false;
			}
		}
		function layerFun(info){
			layer.alert(info,1);
		}
		$("#l_btntj_1").click(function(){
			yz();	
		});
    }]);
});
