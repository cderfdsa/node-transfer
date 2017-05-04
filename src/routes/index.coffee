# 本项目下的 routers

express = require "express"
router = express.Router()
Proxy = require "./../proxy/index"
Member = require "./../model/member"

request = require "request"

# 若登录，刷新token和有效期
router.all "/",(req,res) ->
	token = req.cookies.user_login_token
	if token? and token isnt ""
		Member.flushToken token
		.then (results)->
			if results? and results.err is 0
				res.cookie "user_login_token", results.data.token,{domain:req.app.get("domain")}
				res.cookie "user_login_token_expire", results.data.expire,{domain:req.app.get("domain")}
			res.render "index"
		.catch (err) ->
			console.log('ERR', err)
			res.redirect "/#/404"
	else
		res.render "index"

# 下载 app
router.get "/download",(req,res) ->
	agent = req.get "User-Agent"
	if /iPhone/.test(agent)
		console.log "IPHONE 下载"
		res.redirect "https://itunes.apple.com/cn/app/mei-wan-yi-shi-chao-duo-fu/id1076273010?mt=8"
	else
		console.log "ANDROID 下载"
		res.redirect "http://wap.beautysite.cn/downloads/meiwan.apk"

# 退出登录
router.get "/logout",(req,res) ->
	res.clearCookie "backUrl",{domain:req.app.get("domain")}
	res.clearCookie "user_login_token"
	res.clearCookie "user_login_token_expire"
	res.clearCookie "user_auth_openid"
	res.clearCookie "user_login_token",{domain:req.app.get("domain")}
	res.clearCookie "user_login_token_expire",{domain:req.app.get("domain")}
	res.clearCookie "user_auth_openid",{domain:req.app.get("domain")}
	res.redirect "/"

module.exports = router
