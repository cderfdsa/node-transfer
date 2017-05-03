/**操作记录-美妆商城    						        控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 */

define(['app', 'angular', 'cs!smCss', 'smJs','/common/directive/header/header.js', 'cs!static/css/userCenter/record'], function(app, angular) {

  /*定义 recordCtrl 控制器*/
  app.angular.controller('userCenter/recordCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    /*设置标题*/
    app.myApp.settitle($rootScope, '操作记录-美妆商城');
    $scope.title = $rootScope.nickName + '的操作列表';
    app.myApp.viewport("device");

    //解析时间格式 yy-mm-dd, 返回 date
    function parseDate(str){
      if(typeof str == 'string'){
        var results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);
        if(results && results.length>3)
          return new Date(parseInt(results[1]),parseInt(results[2]) -1,parseInt(results[3]));
        results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);
        if(results && results.length>6)
          return new Date(parseInt(results[1]),parseInt(results[2]) -1,parseInt(results[3]),parseInt(results[4]),parseInt(results[5]),parseInt(results[6]));
        results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/);
        if(results && results.length>7)
          return new Date(parseInt(results[1]),parseInt(results[2]) -1,parseInt(results[3]),parseInt(results[4]),parseInt(results[5]),parseInt(results[6]),parseInt(results[7]));
      }
      return null;
    }

    //date 转换 成 周几
    function parseWeek(date) {
      var weekDay = ["周日","周一","周二","周三","周四","周五","周六"];
      return weekDay[date.getDay()];
    }

    /*初始数据渲染*/
    app.myApp.ajax({
      url: '/sale/memberOperLog',
      data: {memberId: $stateParams.id}
    }, function(res) {
      if (!res.err) {
        var yy = new Date().getFullYear(),
            mm = new Date().getMonth() + 1,
            dd = new Date().getDate();
        $scope.monthArr = [];  //数据按月分组
        $(res.data).each(function(index, item){
          item.updatedAt = item.updatedAt ? item.updatedAt : item.createdAt;
          item.dateDay = item.updatedAt.split("T")[0].split("").slice(5,10).join("");
          item.time = item.updatedAt.split("T")[1].split("").slice(0,5).join("");
          // 今天
          if (item.updatedAt.split("-")[0] == yy && item.updatedAt.split("-")[1] == mm && item.updatedAt.split("T")[0].split("-")[2] == dd) {
            item.date = '今天';
            item.dateDay = item.time;
          // 昨天
          } else if (item.updatedAt.split("-")[0] == yy && item.updatedAt.split("-")[1] == mm && item.updatedAt.split("T")[0].split("-")[2] == (dd-1)) {
            item.date = '昨天';
            item.dateDay = item.time;
          } else {
            var date = parseDate(item.updatedAt.split("T")[0]);
            item.date = parseWeek(date);
          }

          //数据按月分组
          var month = item.updatedAt.split("T")[0].split("").slice(0,7).join("");
          if($scope.monthArr.indexOf(month) == -1) $scope.monthArr.push(month);

        });

        $scope.data = res.data;
        $scope.$digest();
      } else $.toast(res.errMsg);
    })
  }]);
});