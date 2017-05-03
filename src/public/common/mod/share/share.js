define(['app', 'cs!share'], function(app) {
    var share = {};
    var shareObj;
    /**
     * share.setContent对象
     * @param {string}   shareTitle  分享标题
     * @param {string}   shareDesc   分享内容
     * @param {string}   shareImgUrl 分享图片地址
     * @param {string}   shareLink   分享链接地址
     * @param {object}   callback.success分享成功之后回调,callback.cancel分享取消之后回调,callback.wx对外暴露微信对象
     */

    share.setContent = function(shareTitle, shareDesc, shareImgUrl, shareLink, callback) {
        shareObj = {
            'title': encodeURIComponent(shareTitle) || encodeURIComponent('美妆商城'),
            'desc': encodeURIComponent(shareDesc) || encodeURIComponent('美妆商城'),
            'img': encodeURIComponent(shareImgUrl) || encodeURIComponent(''),
            'link': encodeURIComponent(shareLink) || encodeURIComponent('')
        };
        /*如果在微信里 请求分享接口  如果在其它浏览器里 插入自己分享组件*/
        if (app.myApp.naviuser.indexOf('micromessenger/') > -1) {
            require(['wxjs'], function(wx) { //加载微信JS API
                /*请求分享接口*/
                app.myApp.ajax({
                    'url': '/site/wechatSign', //分享接口
                    'data': {
                        'url': encodeURIComponent(location.href.split('#')[0])
                    },
                    'loading': false
                }, function(result) {
                    if (!result.err) {
                        wx.config({
                            'debug': false,
                            'appId': result.data.appId,
                            'timestamp': result.data.timestamp,
                            'nonceStr': result.data.nonceStr,
                            'signature': result.data.signature,
                            'jsApiList': ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard']
                        });
                        var wxdata = {
                            'title': shareTitle,
                            'desc': shareDesc,
                            'link': shareLink,
                            'imgUrl': shareImgUrl
                        }
                        var wxdataTimeline = {
                            'title': shareTitle,
                            'link': shareLink,
                            'imgUrl': shareImgUrl
                        }
                        if (callback) {
                            app.myApp.extend(wxdata, callback); //合并对象
                            app.myApp.extend(wxdataTimeline, callback); //合并对象
                            if (callback.wx) {
                                callback.wx(wx)
                            } //向外提供微信回调对象
                        };
                        wx.onMenuShareAppMessage(wxdata); //分享给朋友
                        wx.onMenuShareTimeline(wxdataTimeline); //分享到朋友圈
                        wx.onMenuShareQQ(wxdata); //分享到QQ
                        wx.onMenuShareWeibo(wxdata); //分享到微博
                        wx.onMenuShareQZone(wxdata); //分享到QQ空间
                    }
                });
            });
        } else {

            $('.popup-share').remove();

            /*插入分享HTML*/
            $('body').append('<div class="popup popup-share"><div class="content-block"><div class="wrap"><div class="li qq"><div class="warp"></div></div><div class="li qqtx"><div class="warp"></div></div><div class="li qqkj"><div class="warp"></div></div><div class="li wb"><div class="warp"></div></div><div class="li rrw"><div class="warp"></div></div></div></div></div>');
            /*关闭分享*/
            $(document).on('click', '.popup-share', function(e) {
                if ($(e.srcElement).hasClass('popup-share')) {
                    $.closeModal('.popup-share');
                }
            });

            /*点击分享各个媒体*/
            $(document).on('click', '.popup-share .li', function() {
                if ($(this).hasClass('qq')) {
                    window.location.href = 'http://connect.qq.com/widget/shareqq/index.html?url=' + shareObj.link + '&desc=' + shareObj.title + '&pics=' + shareObj.img + '&site=' + shareObj.title + '';
                    return;
                } else if ($(this).hasClass('qqtx')) {
                    window.location.href = 'http://share.v.t.qq.com/index.php?c=share&a=index&title=' + shareObj.title + '&site=' + shareObj.link + '&pics=' + shareObj.img + '&url=' + shareObj.link + '&assname=' + shareObj.desc + '';
                } else if ($(this).hasClass('qqkj')) {
                    window.location.href = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + shareObj.link + '?' + '&title=' + shareObj.title + '&pics=' + shareObj.img + '&summary=' + shareObj.desc + '';
                } else if ($(this).hasClass('wb')) {
                    window.location.href = 'http://service.weibo.com/share/share.php?appkey=583395093&title=' + shareObj.title + '&url=' + shareObj.link + '&source=' + shareObj.desc + '&retcode=0&ralateUid=';
                } else if ($(this).hasClass('rrw')) {
                    window.location.href = 'http://widget.renren.com/dialog/share?resourceUrl=' + shareObj.link + '&srcUrl=' + shareObj.link + '&title=' + shareObj.title + '&images=' + shareObj.img + '&description=' + shareObj.desc + '';
                }
            });
        }

    };

    /*点击弹出分享*/
    share.popupShare = function() {
        if (app.myApp.iniValue.isApp) {
            if (typeof window.jsObj !== 'undefined') {
                window.jsObj.jump('shareApp', JSON.stringify({
                    'title': decodeURIComponent(shareObj.title), //标题
                    'content': decodeURIComponent(shareObj.desc), //内容
                    'imageUrl': decodeURIComponent(shareObj.img), //图片地址
                    'shareUrl': decodeURIComponent(shareObj.link) //链接地址
                }));
            }
        } else {

            if (app.myApp.naviuser.indexOf('micromessenger/') > -1) {

                /*在微信点击提示*/
                $('<div class="wxfx" onclick="this.style.display=\'none\'"></div>').appendTo('.page');
            } else if (app.myApp.naviuser.indexOf('ucbrowser/') > -1) {

                /*在UC QQ 浏览器 中加载ucqqapiJS*/
                require(['js/controllers/share/ucqqapi'], function(api) {
                    var config = {
                        'url': decodeURIComponent(shareObj.link),
                        'title': decodeURIComponent(shareObj.title),
                        'desc': decodeURIComponent(shareObj.desc),
                        'img': decodeURIComponent(shareObj.img),
                        'img_title': decodeURIComponent(shareObj.title),
                        'from': decodeURIComponent(shareObj.title)
                    };
                    /*挂起QQ UC 原生分享*/
                    var nashare = new api.nativeShare(config);
                    nashare.share('');
                });
            } else {
                $.popup('.popup-share');
            }

            $("body").on("click", ".modal-overlay", function() { // close tip modal
                $.closeModal();
            });
        }
    };
    return share;
});