define(["app","angular"],function(i){i.angular.controller("mainCtrl",["$rootScope","$state","$location",function(n){n.$on("$stateChangeStart",function(i,t,a,r,l){n.toState=t,n.toParams=a,n.fromState=r,n.fromParams=l}),i.angular.directive("limitlogin",function(){return{restrict:"A",replace:!1,link:function($scope,n,t){n.on("click",function(n){n.preventDefault();var a=t.limitlogin||t.href||location.hash;return i.myApp.iniValue.isWeiXin?void i.myApp.thirdLogin("weixin",a):void(0!=i.myApp.ifLogin(a)&&(location.hash=a))})}}})}])});