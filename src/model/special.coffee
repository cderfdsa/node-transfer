# created by zl at 2016-08-12 17:58
Promise = require "bluebird"
request = require "request"
module.exports =
class Special
  @detail:(id) ->
    new Promise (resolve,reject) ->
      wilddogConfig.get "api"
      .then (data) ->
        opt =
          method:"GET"
          url:"http://#{data.host}:#{data.port}/mobile/special/#{id}/detail"
          json:true
        request opt,(err,response,body) ->
          resolve body
      .catch (err)->
        reject err
