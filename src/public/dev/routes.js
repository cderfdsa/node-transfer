
/**routesjs  依赖JS
 * @param {string} ['app']       app.js
 */
define(['app'], function (app) {

    /*原生APP挂起JS方法*/
    window.fromAppLogin = function(obj){
        var result = typeof obj == 'object'?obj:JSON.parse(obj);
        app.myApp.iniValue.appData = result;
        app.myApp.iniValue.key = result.key;
        app.myApp.iniValue.isApp = true;
        app.myApp.iniValue.cityId = result.cityId;
        app.myApp.iniValue.fromhw = result.fromhw;
        app.myApp.iniValue.isLogin() = result.key?true:false;
        if(!result.key){

            /*删除本地数据*/
            app.myApp.localStorage.removeItem('appData');
            app.myApp.localStorage.removeItem('key');
            app.myApp.localStorage.removeItem('cityId');
            app.myApp.localStorage.removeItem('isLogin');
        }
    };

    /*angular.run 方法*/
    app.angular.run(['$state', '$stateParams', '$rootScope', function ($state, $stateParams, $rootScope) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.init = {
            'headinfo' : {
                'description'   : '',
                'keywords'      : '',
                'title'         : ''
            }
        };
    }]);

    /*angular.config 方法*/
    app.angular.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        /*URL地址配置*/
        var url = {
            'temp'  : function(path){return app.myApp.iniValue.template+path+'.html?'+$.urlArgs;},
            'ctrl'  : function(path){return app.myApp.iniValue.controller+path+'Ctrl';},
            'ct'    : function(path){return path+'Ctrl';},
            'depe'  : function(){
                var newAry = [];
                for(var i=0;i<arguments.length;i++){
                   newAry.push(app.myApp.iniValue.service+arguments[i])
                }
                return newAry;
            }
        };

        /*$stateProvider配置*/
        var config = function(path, paramer, depe){
            return {
                url: '/' + path.replace(/\/index$/g, '') + (paramer || ''),
                templateUrl: url.temp(path),
                controllerUrl: url.ctrl(path),
                controller: url.ct(path),
                dependencies: url.depe(depe||'initService')
            }
        };

        /*重定向*/
        $urlRouterProvider
            .when('', '/home')
            .otherwise('/404');

        /*$stateProvider.state方法*/
        $stateProvider
        /* 线上 */
            .state('404', config('404'))

            /* 首页 */
            .state('home/index', config('home/index'))                                              /*首页*/
                .state('home/special', config('home/special', '/:id?shareKey'))                     /*专题*/                                                          /*404*/
                .state('home/promotion', config('home/promotion','/:type'))                         /*特卖专区*/

            /* 爆款购 */
            .state('goods/index', config('goods/index'))                                            /*爆款购*/
                .state('goods/select', config('goods/select'))                                      /*商品分类*/
                .state('goods/search', config('goods/search', '/:type'))                            /*商品搜索*/
                    .state('goods/detail', config('goods/detail', '/:proId?shareKey'))              /*商品详情*/
                        .state('goods/comment', config('goods/comment', '/:proId'))                 /*商品评论*/
                .state('goods/specify', config('goods/specify'))                                    /*指定商品*/

            /* 社区 */
            .state('community/list', config('community/list', '/:tab'))                             /*女神说 推荐0、最新1、关注2*/
                .state('community/home', config('community/home', '/:id'))                          /*用户首页*/
                .state('community/topic', config('community/topic'))                                /*话题*/
                    .state('community/topicDetail', config('community/topicDetail', '/:name'))      /*话题详情*/
                        .state('community/wow', config('community/wow', '/:id'))                    /*wow列表*/
            .state('community/postPicture', config('community/postPicture'))                        /*PO图*/
                .state('community/addTags', config('community/addTags', '/:type'))                  /*添加标签*/
                .state('community/postPictureDetail', config('community/postPictureDetail', '/:id'))/*PO图详情、代言笔记详情*/
                .state('community/postDetailShare', config('community/postDetailShare', '/:id?shareKey'))    /*分享详情(PO图、代言笔记)*/
            .state('community/note', config('community/note'))                                      /*代言笔记*/
                .state('community/beautyGoods', config('community/beautyGoods'))                    /*美物商品*/
                    .state('community/rule', config('community/rule'))                              /*社区内容管理规定*/


            /* 购物流order */
            .state('order/cart', config('order/cart'))                                              /*购物车*/
                .state('order/confirm', config('order/confirm', '/:isCart'))                        /*确认订单 isCart(0/1)是否来自购物车*/
                    .state('order/pay', config('order/pay', '/:orderId?from'))                      /*支付订单*/
                     .state('order/myOrder', config('order/myOrder', '/:type'))                     /*我的订单*/
                        .state('order/detail', config('order/detail', '/:id'))                      /*订单详情*/
                        .state('order/coupons', config('order/coupons', '/:orderId'))               /*使用红包*/

            /* 任务 */
            .state('task/grow', config('task/grow'))                                                /*成长中心*/
                .state('task/explain', config('task/explain'))                                      /*任务说明*/
            .state('task/sign', config('task/sign'))                                                /*签到*/
                .state('task/signRecord', config('task/signRecord'))                                /*签到记录*/

            /* 用户中心 */
            .state('userCenter/index', config('userCenter/index'))                                  /*我的*/
                .state('userCenter/myfaceValue', config('userCenter/myfaceValue'))                  /*我的颜值*/
                .state('userCenter/redPacket', config('userCenter/redPacket', '/:type'))            /*我的红包*/
                    .state('userCenter/redPacketExplain', config('userCenter/redPacketExplain'))    /*红包说明*/
                .state('userCenter/userInfo', config('userCenter/userInfo'))                        /*个人信息*/
                    .state('userCenter/numberChanges', config('userCenter/numberChanges'))          /*手机更换*/
                    .state('userCenter/addressEdit', config('userCenter/addressEdit', '?type&id'))  /*添加/编辑收货地址*/
                    .state('userCenter/address', config('userCenter/address', '?type'))             /*我的收货地址*/
                    .state('userCenter/addComment', config('userCenter/addComment', '/:oid'))       /*添加评论*/
                .state('userCenter/myComment', config('userCenter/myComment'))                      /*我的评论*/
                    .state('userCenter/record', config('userCenter/record', '/:id'))                /*操作记录*/
                        .state('userCenter/orderDetail', config('userCenter/orderDetail', '/:id?type&value'))/*订单详情*/
                .state('userCenter/suggest', config('userCenter/suggest'))                          /*建议反馈*/
                .state('userCenter/temperamentValue', config('userCenter/temperamentValue'))        /*气质值*/
                    .state('userCenter/level', config('userCenter/level', '/:type'))                /*会员等级（type: 0/1 气质/大使）*/
                .state('userCenter/balance', config('userCenter/balance', '/:type'))                /*余额*/
                    .state('userCenter/inviteBonus', config('userCenter/inviteBonus', '/:code'))    /*邀请闺蜜好友分享页*/
                        .state('userCenter/inviteRecord', config('userCenter/inviteRecord'))        /*邀请闺蜜好友记录*/
                    .state('userCenter/collect', config('userCenter/collect'))                      /*种草单*/

                // 我的消息
                .state('userCenter/message', config('userCenter/message', '/:memberId'))            /*我的消息*/
                .state('userCenter/follow', config('userCenter/follow', '/:isSelf/:memberId'))      /*我的关注*/
                .state('userCenter/comment', config('userCenter/comment'))                          /*我的粉丝*/
                .state('userCenter/wow', config('userCenter/wow'))                                  /*我的WOW*/
                .state('userCenter/fans', config('userCenter/fans', '/:isSelf/:memberId'))          /*我的粉丝*/
                .state('userCenter/secretary', config('userCenter/secretary', '/:type'))            /*大使公告、美妆秘书 0/1*/
                    .state('userCenter/secretaryDetail', config('userCenter/secretaryDetail'))      /*美妆秘书-详情*/

                /* 分销 */
                .state('userCenter/ambCenter/index', config('userCenter/ambCenter/index'))          /*大使中心*/
                    .state('userCenter/ambCenter/incomeDetail', config('userCenter/ambCenter/incomeDetail', '?type&frozen'))/*收益明细*/
                    .state('userCenter/ambCenter/achievementDetail', config('userCenter/ambCenter/achievementDetail', '?type&frozen'))/*业绩明细*/
                    .state('userCenter/ambCenter/myAmb', config('userCenter/ambCenter/myAmb'))          /*我的大使*/
                    .state('userCenter/ambCenter/bestieUser', config('userCenter/ambCenter/bestieUser'))/*我的用户*/
                    .state('userCenter/ambCenter/amount', config('userCenter/ambCenter/amount', '/:tab'))/*业绩/收益 tab: exploit/income*/
                    .state('userCenter/ambCenter/invite', config('userCenter/ambCenter/invite', '/:type'))/*邀请大使/闺蜜好友 type: 0/1*/
                    .state('userCenter/ambCenter/special', config('userCenter/ambCenter/special', '?code'))/*大使专题页*/
                    .state('userCenter/ambCenter/specialBuy', config('userCenter/ambCenter/specialBuy'))   /*购买校园大使套餐*/
                        .state('userCenter/ambCenter/buySuccess', config('userCenter/ambCenter/buySuccess'))/*购买校园大使套餐成功页*/
                        .state('userCenter/ambCenter/explain', config('userCenter/ambCenter/explain'))  /*规则说明列表*/
                        .state('userCenter/ambCenter/explainDetail', config('userCenter/ambCenter/explainDetail','/:type'))/*规则说明详情*/
                    .state('userCenter/ambCenter/poster', config('userCenter/ambCenter/poster'))    /*推广海报*/

                // 用户中心登录模块
                .state('userCenter/login/signIn', config('userCenter/login/signIn', '/:type'))      /*用户登录*/
                    .state('userCenter/login/perfectInfo', config('userCenter/login/perfectInfo'))  /*完善信息*/
                .state('userCenter/login/setting', config('userCenter/login/setting'))              /*设置*/
                .state('userCenter/login/bindAccount', config('userCenter/login/bindAccount'))      /*账号绑定*/
                .state('userCenter/login/bindPhone', config('userCenter/login/bindPhone'))          /*绑定手机号码*/
                .state('userCenter/login/password', config('userCenter/login/password', '/:type'))  /*设置/重置密码 0/1*/
                .state('userCenter/login/realID', config('userCenter/login/realID'))                /*实名认证*/

            /* 活动 */
            .state('activity/pilotProduct', config('activity/pilotProduct'))                        /*美妆合肥试点产品活动*/
            .state('activity/redBag', config('activity/redBag','/:oid'))                            /*订单红包*/
            .state('activity/goodsRedPacket', config('activity/goodsRedPacket', '/:oid/:code'))     /*领取指定商品红包*/
            .state('activity/newVersion', config('activity/newVersion'))                            /*新版上线*/
            .state('activity/represent', config('activity/represent'))                              /*赚代言费*/
            // 拉新
            .state('activity/getNew/index', config('activity/getNew/index'))                        /*拉新活动*/
            .state('activity/getNew/diagnosis', config('activity/getNew/diagnosis'))                /*拉新活动-诊断书*/
            .state('activity/getNew/award', config('activity/getNew/award'))                        /*拉新活动-领取奖品*/
            .state('activity/getNew/success', config('activity/getNew/success'))                    /*拉新活动-领取成功*/

            /* 合作平台 */
            .state('platform/signIn', config('platform/signIn'))                                    /*登录*/
                .state('platform/search', config('platform/search', '/:type'))                      /*搜索(type:0/1 账号登录/邀请码登录)*/

        /* 待上线 */


        /* 开发中 */
            .state('goods/distribution', config('goods/distribution'))                              /*分销商品列表*/



        /* 未迁移 */
            .state('setWithdrawalsAccount', config('setWithdrawalsAccount'))/*设置提现账号*/
            .state('withdrawalsRecord', config('withdrawalsRecord'))/*提现记录*/
            .state('applyWithdrawals', config('applyWithdrawals'))/*申请提现*/
            .state('applyOpen', config('applyOpen', '/:id'))/*求开通*/


        // 待定
                 .state('selectCity', config('selectCity'))                                          /*选择城市*/
                    .state('selectSchool', config('selectSchool', '/:cityId'))                      /*选择学校*/
    }]);
});
