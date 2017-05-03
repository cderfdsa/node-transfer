request = require "request"

module.exports =
class WeixinDistributeCtrl
  @callback:(req,res) ->
    code = req.cookies.distributor_invite_code
    sex = req.cookies.distributor_invite_sex
    user = req.user
    wilddogConfig.get "api"
    .then (data) ->
      opt =
        method:"POST"
        url:"http://#{data.host}:#{data.port}/mobile/distributor/createPoster"
        form:{code,sex,name:user.nickName,headImage:user.headImg}
        json:true
      request opt
      .on "error",(err) ->
        res.redirect "/#/404"
      .pipe res
    .catch (err)->
      res.redirect "/#/404"
