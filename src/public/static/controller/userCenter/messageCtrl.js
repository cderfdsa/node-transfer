/**我的消息-美妆商城    						          控制器 依赖JS CSS
 * @param   {string} 'app'                  	app.js
 * @param   {string} 'angular'              	angular.min.js
 * @param   {string} 'cs!style'        			  style.css
 * @param   {string} 'cs!smCss'         		  sm.min.css
 * @param   {string} 'smJs'                   sm.min.js
 * @param   {string} 'socket'                 socket.io-1.4.5.js
 */

define(['app', 'angular', /*'socket',*/ 'cs!style', 'cs!smCss', 'smJs', '/common/directive/header/header.js', 'cs!static/css/userCenter/message'], function(app, angular, socket) {

  /*定义 messageCtrl 控制器*/
  app.angular.controller('userCenter/messageCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$http', function($rootScope, $scope, $state, $stateParams, $http) {
   $.extend($scope, {
      init: function() {
        this.staticScope();
        this.initAjax();
        // this.socketIo();
      },

      /* 初始化静态 $scope */
      staticScope: function() {
        app.myApp.settitle($rootScope, '我的消息-美妆商城'); // 设置 title
        app.myApp.viewport("device"); // 设置viewport
      },

      /* 初始化数据 */
      initScope: function() {
        return [{
          title: '评论',
          link: '#/userCenter/comment',
          img: 'icon_comment'
        }, {
          title: 'WOW',
          link: '#/userCenter/wow',
          img: 'icon_wow'
        }, {
          title: '新粉丝',
          link: '#/userCenter/fans/1/' + $stateParams.memberId + '?date=true',
          img: 'icon_fans'
        }, {
          title: '美妆秘书',
          link: '#/userCenter/secretary/1',
          img: 'icon_notify'
        }];
      },

      /* 初始化ajax数据 */
      initAjax: function(){
        var self = this;

        app.myApp.ajax({  // 用户未读消息统计
          url: '/community/unreadNotice'
        }, function(res) {
          if (!res.err) {
            var staticData = self.initScope();
            $(res.data).each(function(index, item){
              switch (item._id) {
                case 0: staticData[3].count = item.count;
                        break;
                case 1: staticData[2].count = item.count;
                        break;
                case 2: staticData[0].count = item.count;
                        break;
                case 3: staticData[1].count = item.count;
                        break;
              }
            });

            $scope.data = staticData;
            $scope.$digest();
          } else $.toast(res.errMsg);
        });
      },

      /* 消息实时推送 */
      socketIo: function(){
        var io = socket($domain);

        io.on('news', function (data) { // 收到新信息
        });

        io.emit('my other event', { my: 'data' });  // 推送信息
      }
    });

    $scope.init();

  }]);
});

 // 1.实时推送
