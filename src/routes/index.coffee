# 本项目下的 routers

express = require "express"
router = express.Router()
Proxy = require "./../proxy/index"
Member = require "./../model/member"

request = require "request"

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

router.get "/download",(req,res) ->
  agent = req.get "User-Agent"
  if /iPhone/.test(agent)
    console.log "IPHONE 下载"
    res.redirect "https://itunes.apple.com/cn/app/mei-wan-yi-shi-chao-duo-fu/id1076273010?mt=8"
  else
    console.log "ANDROID 下载"
    res.redirect "http://wap.beautysite.cn/downloads/meiwan.apk"

router.get "/logout",(req,res) ->
  res.clearCookie "backUrl",{domain:req.app.get("domain")}
  res.clearCookie "user_login_token"
  res.clearCookie "user_login_token_expire"
  res.clearCookie "user_auth_openid"
  res.clearCookie "user_login_token",{domain:req.app.get("domain")}
  res.clearCookie "user_login_token_expire",{domain:req.app.get("domain")}
  res.clearCookie "user_auth_openid",{domain:req.app.get("domain")}
  res.redirect "/"

router.get "/page/activity/include/:page",(req,res) ->
  page = req.params.page
  agent = req.get "User-Agent"
  if agent.indexOf("MeiWanApp") > -1
    res.redirect "/page/activity/include/#{page}.html"
  else
    res.redirect "/#/activity/#{page}"


router.get "/page/seniorDesc",(req,res) ->
  page = req.params.page
  agent = req.get "User-Agent"
  if agent.indexOf("MeiWanApp") > -1
    res.redirect "/?from=app#/userCenter/ambCenter/explain"
  else
    res.redirect "/#/userCenter/ambCenter/explain"

module.exports = router
