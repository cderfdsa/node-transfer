/**404页面  控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!smCss'             sm.min.css
 * @param   {string} 'cs!style'             style.css
 * @param   {string} 'smJs'                 sm.min.js
 */
define(['app', 'angular', 'cs!style', 'cs!smCss', 'smJs', '/common/directive/header/header.js', 'cs!static/css/404'], function(app, angular) {

    /*定义 404Ctrl 控制器*/
    app.angular.controller('404Ctrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
        /*设置标题*/
        app.myApp.settitle($rootScope, '404');

        // 设置 domain
        $scope.domain = $domain;

        // 设置 device
        app.myApp.viewport("device");

        /*定时跳转*/
        $scope.second = 5;
        var countDown = setInterval(function(){
            if($scope.second-- == 1){
                clearInterval(countDown);
                // location.hash = '';
                if (location.hash == '#/404') location.href = $domain;
            }else{
                $scope.$digest();
            }
        }, 1000);
    }]);
});
