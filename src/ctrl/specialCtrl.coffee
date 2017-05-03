# created by zl at 2016-08-12 18:00
Special = require "./../model/special"
Member = require "./../model/member"
module.exports =
class SpecialCtrl
  @detail:(req,res) ->
    id = req.params.sid
    Special.detail id
    .then (result) ->
      if result.err is 0
        res.render "special",{special:result.data}
      else
        res.send "参数错误"
    .catch (err) ->
      res.send "参数错误"
