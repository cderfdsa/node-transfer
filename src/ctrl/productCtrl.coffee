# created by zl at 2016-08-12 11:34
Product = require "./../model/product"
Member = require "./../model/member"
async = require "async"
module.exports =
class ProductCtrl
  @detail:(req,res) ->
    id = req.params.gid
    token = req.query.token
    async.auto
      member:(cb) ->
        if token?
          Member.detail token
          .then (res) ->
            if res? and res.err is 0
              cb null,res.data
            else
              cb null
          .catch (err) ->
            cb err
        else
          cb null
      detail:(cb) ->
        Product.detail id
        .then (result) ->
          if result.err is 0
            cb null,result.data
          else
            cb new Error result.message
        .catch (err) ->
          cb err
      comments:(cb) ->
        Product.detailComments id
        .then (result) ->
          if result.err is 0
            cb null,result.data
          else
            cb null,{count:0,rows:[]}
        .catch (err) ->
          cb err
      stat:(cb) ->
        Product.commentStat id
        .then (result) ->
          if result.err is 0
            cb null,result.data
          else
            cb new Error result.message
        .catch (err) ->
          cb err
      (err,results) ->
        if err?
          console.log('ERR', err)
          res.send "参数错误"
        else
          res.render "detail",{product:results.detail,comments:results.comments,stat:results.stat,isSenior:results.member?.seniorMember?}
