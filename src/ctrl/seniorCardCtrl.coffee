# created by zl at 2016-09-26 20:20
module.exports =
class SeniorCardCtrl
  @activePage:(req,res) ->
    openId = req.cookies.user_auth_openid
    res.render "cardActive",{openId:if openId? then openId else ""}
