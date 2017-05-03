/**求开通    控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'layerJs'         		layer.min.js
 * @param   {string} 'cs!css/style'         style.css
 * @param   {string} 'cs!css/applyOpen'     applyOpen.css
 */
define(['app', 'angular', 'layerJs', 'cs!css/style', 'cs!css/applyOpen'], function(app, angular, layer) {

    /*定义 applyOpenCtrl 控制器*/
    app.angular.controller('applyOpenCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
        /*设置标题*/
        app.myApp.settitle($rootScope, '求开通');

        /*点赞 toast*/
		$.toast = function(){
			$toast = $("#toast");
			$toast.show();
			setTimeout('$toast.hide()', 3000);
			
		}

		/*点赞 0<percent<1*/
		$.percent = function(percent){
			var $span = $(".progressBar span"),
				newPer = parseInt($span.text().split("%")[0]) + 100*percent;
				newPer = newPer > 99 ? 99 : newPer;
			if (newPer < 100) {
				$(".progressBar i").width(newPer + '%');
				$span.text(newPer + '%');
			}

		}

		/*获取学校*/
		$.post($ajaxDomain + '/site/schoolInfo', {schoolId: $stateParams.id}, function(res){
			if (res.err == 0) {
				$scope.schoolName = res.data.name;
				$scope.$digest();
			}
			else {
				layer.alert(res.errMsg);
			}
		},'json');

		/*获取点赞数*/
		$.post($ajaxDomain + '/site/schoolLikeNums', {schoolId: $stateParams.id}, function(res){
			if (res.err == 0) {
				$scope.praiseNum = parseFloat(res.data);
				$scope.$digest();
			}
			else {
				layer.alert(res.errMsg);
			}
		},'json');

		/*点击点赞按钮*/
		$scope.praiseFn = function (percent){
			$.post($ajaxDomain + '/site/addSchoolLike', {schoolId: $stateParams.id}, function(res){
				if (res.err == 0) {
					var percent = 0.01;
					$.toast();
					$.percent(percent);
				}
				else {
					layer.alert(res.errMsg);
				}
			},'json');
		};
    }]);
});