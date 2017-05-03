/**签到记录-美妆商城                        控制器 依赖JS CSS
 * @param   {string} 'app'                  app.js
 * @param   {string} 'angular'              angular.min.js
 * @param   {string} 'cs!css/smCss'         sm.min.css
 * @param   {string} 'smJs'                 sm.min.js
 * @param   {string} 'pager'                pager.js
 * @param   {string} 'moment'               moment.js
 */

define(['app', 'angular', 'moment', 'cs!smCss', 'smJs', 'pager', '/common/directive/header/header.js', 'cs!static/css/task/signRecord'], function(app, angular, moment) {

  /*定义 recordCtrl 控制器*/
  app.angular.controller('task/signRecordCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
    /*设置标题*/
     /*设置标题*/
     app.myApp.settitle($rootScope, '签到记录-美妆商城');
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

    /*初始数据渲染 分页*/
    $scope.monthArr = [];  //数据按月分组

    $.pager({
      $scope: $scope,
      scrollEle: '.content',
      repeatEle: 'li',
      page: 0,
      repeatArr: 'data',
      url: '/account/signRecord',
      callBack: function(res) {

        var yy = new Date().getFullYear(),
            mm = new Date().getMonth() + 1,
            dd = new Date().getDate();
        $(res.data).each(function(index, item){
            item.updatedAt = item.updatedAt ? item.updatedAt : item.createdAt;          //2016-05-16T01:34:51.360z
            item.updatedAt = moment(item.updatedAt).format('YYYY-MM-DDTHH:mm');         // moment 转时间 2016-05-16T01:34
            item.dateDay = item.updatedAt.split("T")[0].split("").slice(5,10).join(""); //05-16
            item.time = item.updatedAt.split("T")[1].split("").slice(0,5).join("");     //01:34

            if (item.updatedAt.split("-")[0] == yy && item.updatedAt.split("-")[1] == mm && item.updatedAt.split("T")[0].split("-")[2] == dd) {
                item.date = "今天",
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
        if ($scope.data) $scope.data = $scope.data.concat(res.data);
        else $scope.data = res.data;
        $scope.$digest();
      }
    });
  }]);
});