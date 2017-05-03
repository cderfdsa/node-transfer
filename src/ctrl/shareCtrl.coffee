# created by zl at 2016-08-17 15:40
qs = require "querystring"
module.exports =
class ShareCtrl
  @share:(req,res,next) ->
    agent = req.get "User-Agent"
    token = req.cookies.user_login_token
    expire = req.cookies.user_login_token_expire
    if (not token? or expire < Date.now()) and (agent.indexOf("MicroMessenger") > -1)
      req.query.backUrl = "#{req.path}?#{qs.stringify(req.query)}"
      next()
    else
      res.redirect "/##{req.path}?#{qs.stringify(req.query)}"
