# passport 实现 微博 登录

express = require "express"
router = express.Router()
passport = require "passport"
WeiboStrategy = require("passport-weibo").Strategy
AuthCtrl = require "./../ctrl/authCtrl"
authConfig = require './../config/auth.json'

opt =
	callbackURL: authConfig.web.backUrl.weibo
	clientID: authConfig.auth.weibo.id
	clientSecret: authConfig.auth.weibo.key

weiboStrategy = new WeiboStrategy opt,(accessToken, refreshToken, profile, done) ->
	user =
		source:1
		token:profile.id
		nickName:profile.displayName
		headImg:profile._json.profile_image_url
		sex:if profile._json.gender is "m" then 1 else 2
	done null,user

passport.use weiboStrategy
router.get "/",passport.authenticate("weibo"),(req,res) ->
router.get "/callback",passport.authenticate("weibo", failureRedirect:"/login",session:false),AuthCtrl.callback

module.exports = router
