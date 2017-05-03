Member = require "./../model/member"
try
  ccap = require "ccap"
catch error
_ = require "lodash"
module.exports =
class AuthCtrl
  @getCode:(req,res) ->
    code = ccap
      width:100
      height:40
      offset:20
      fontsize:30
      generate:() ->
        codes = ["a","b","c","d","e","f","g","h","j","k","m","n","p","r","s","t","u","v","w","x","y","2","3","4","5","6","7","8","9"]
        rd = (codes[(_.random 0,codes.length-1)] for i in [0...4])
        rd.join("").toUpperCase()
    [text,buf] = code.get()
    req.session.code = text
    res.end buf

  @callback:(req,res) ->
    user = req.user
    console.log('第三方登陆来源:', user.source)
    if res.locals.thirdLoginBind
      token = req.cookies.user_login_token
      if token?
        console.log "第三方绑定有token"
        Member.thirdBind token,user.token,user.source
        .then (results) ->
          res.clearCookie "thirdLoginBind"
          res.redirect encodeURI("/##{req.cookies.backUrl}?err=#{results.err}&errMsg=#{results.errMsg}")
      else
        console.log "第三方绑定没有token"
        res.redirect "/#/404"
    else
      Member.thirdLogin user.token,user.source,user.nickName,user.headImg,user.sex,user.remark
      .then (results) ->
        console.log('RESULTS', results)
        if results? and results.err is 0
          console.log "第三方登陆成功"
          res.cookie "user_login_token", results.data.token,{domain:req.app.get("domain")}
          res.cookie "user_login_token_expire", results.data.expire,{domain:req.app.get("domain")}
          res.cookie "user_auth_openid",user.remark,{domain:req.app.get("domain")} if user.remark?
          res.cookie "user_auth_unionid",user.unionid,{domain:req.app.get("domain")} if user.unionid?
          backUrl = req.cookies.backUrl
          fromSignIn = req.cookies.fromSignIn
          from = req.cookies.from
          console.log('FROM', from)
          console.log('BACKURL', typeof backUrl)
          if from is "cardPay"
            console.log('FROM CARDPAY')
            url = "/h5/card/active/"
          else if from is "v"
            console.log('FROM VUE')
            url = "#{backUrl}"
          else if backUrl?
            if from is "wechat"
              console.log('FROM WECHAT')
              url = "#{decodeURIComponent(backUrl)}"
            else
              url = "/##{backUrl}"
              url += "?fromSignIn=true" if fromSignIn?
            res.clearCookie "from"
          else
            url = "/"
          console.log('URL', url)
          res.redirect url
        else
          console.log "第三方登陆失败"
          res.redirect "/#/404"

  @setBackUrl:(req,res,next) ->
    backUrl = req.query.backUrl
    fromSignIn = req.query.fromSignIn
    from = req.query.from
    path = req.path
    if path.indexOf("/v/")>-1
      backUrl = req.path
      from = "v"
    res.cookie "backUrl", backUrl,{domain:req.app.get("domain")} if backUrl?
    res.cookie "fromSignIn", fromSignIn,{domain:req.app.get("domain")} if fromSignIn?
    res.cookie "from", from if from?
    res.locals.thirdLoginBind = (req.cookies.thirdLoginBind? and req.cookies.thirdLoginBind isnt "")
    console.log "----设置授权完成跳转----"
    console.log('PATH', req.path)
    console.log('DOMAIN', req.app.get("domain"))
    console.log('BACKURL', backUrl)
    console.log('FROMSIGNIN', fromSignIn)
    console.log('FROM', from)
    console.log "----设置授权完成跳转----"
    next()

  @checkIsWeixin:(req,res,next) ->
    agent = req.get "User-Agent"
    if agent.indexOf("MicroMessenger") > -1
      console.log "---------MicroMessenger---------"
      token = req.cookies.user_login_token
      expire = req.cookies.user_login_token_expire
      if token? and expire > Date.now()
        next()
      else
        res.redirect "/auth/weixin"
    else
      next()
