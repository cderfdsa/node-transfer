express = require "express"
router = express.Router()
passport = require "passport"
WeixinStrategy = require "passport-weixin"
WeixinDistributeCtrl = require "./../ctrl/weixinDistributeCtrl"
api = require "./api"
opt = null
wilddogConfig.get "web"
.then (web) ->
  opt =
    callbackURL: web.backUrl.weixinDistribute
    requireState: false
    authorizationURL: "https://open.weixin.qq.com/connect/oauth2/authorize"
    scope: 'snsapi_userinfo'
  wilddogConfig.get "auth"
.then (auth)->
  opt.clientID=auth.weixinDistribute.id
  opt.clientSecret=auth.weixinDistribute.key
  weixinStrategy = new WeixinStrategy opt,(accessToken, refreshToken, profile, done) ->
    user =
      source:0
      token:profile.id
      nickName:profile.displayName
      headImg:profile._json.headimgurl
      sex:if profile._json.gender is 1 then 1 else 2
      remark:profile._json.openid
      unionid:profile._json.unionid
    done null,user

  passport.use "weixinDistribute",weixinStrategy
  router.use "/api",api
  router.get "/",(req,res) ->
    console.log "这是DIST子域名"
    res.render "index"
  router.get "/distributor/downloadPic",(req,res) ->
    inviteCode = req.query.inviteCode
    sex = req.query.sex
    res.cookie "distributor_invite_code",inviteCode
    res.cookie "distributor_invite_sex",sex
    res.redirect "/auth/weixinDistribute"
  router.get "/auth/weixinDistribute",passport.authenticate("weixinDistribute"),(req,res) ->
  router.get "/auth/weixinDistribute/callback",passport.authenticate("weixinDistribute", failureRedirect:"/login",session:false),WeixinDistributeCtrl.callback

module.exports = router
