# passport 实现 QQ 登录

express = require 'express'
router = express.Router()
passport = require 'passport'
QQStrategy = require('passport-qq').Strategy
AuthCtrl = require './../ctrl/authCtrl'
authConfig = require './../config/auth.json'

opt =
	callbackURL: authConfig.web.backUrl.qq
	clientID: authConfig.auth.qq.id
	clientSecret: authConfig.auth.qq.key

qqStrategy = new QQStrategy opt, (accessToken, refreshToken, profile, done) ->
	user =
		source: 2
		token: profile.id
		nickName: profile.nickname
		headImg: profile._json.figureurl_qq_2
		sex: if profile._json.gender is "男" then 1 else 2
	done null,user

passport.use qqStrategy
router.get "/", passport.authenticate("qq"), (req,res) ->
router.get "/callback", passport.authenticate("qq", failureRedirect: "/login", session: false), AuthCtrl.callback

module.exports = router
