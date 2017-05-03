# create by zl at 2016-07-28 11:35
Promise = require "bluebird"
request = require "request"
module.exports =
class Member
  @detail:(token) ->
    new Promise (resolve,reject) ->
      wilddogConfig.get "api"
      .then (data) ->
        opt =
          method:"GET"
          url:"http://#{data.host}:#{data.port}/mobile/member/detail"
          qs:{token}
          json:true
        request opt,(err,response,body) ->
          resolve body
      .catch (err)->
        reject err


  @flushToken:(token) ->
    new Promise (resolve,reject) ->
      wilddogConfig.get "api"
      .then (data) ->
        opt =
          method:"POST"
          url:"http://#{data.host}:#{data.port}/mobile/member/flushtoken"
          form:{token}
          json:true
        request opt,(err,response,body) ->
          resolve body
      .catch (err)->
        reject err

  @thirdLogin:(token,source,others...) ->
    new Promise (resolve,reject) ->
      [nickName,headImg,sex,remark,uuid] = others
      v="1.0"
      wilddogConfig.get "api"
      .then (data) ->
        opt =
          method:"POST"
          url:"http://#{data.host}:#{data.port}/mobile/member/thirdLogin"
          form:{token,source,nickName,headImg,uuid,sex,v,remark}
          json:true
        request opt,(err,response,body) ->
          resolve body
      .catch (err)->
        reject err

  @thirdBind:(token,thirdToken,source) ->
    new Promise (resolve,reject) ->
      v="1.0"
      wilddogConfig.get "api"
      .then (data) ->
        opt =
          method:"POST"
          url:"http://#{data.host}:#{data.port}/mobile/member/third/bind"
          form:{token,thirdToken,source,v}
          json:true
        request opt,(err,response,body) ->
          resolve body
      .catch (err)->
        reject err
