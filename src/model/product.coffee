# created by zl at 2016-08-12 11:32
Promise = require "bluebird"
request = require "request"
module.exports =
class Product
  @detail:(id) ->
    new Promise (resolve,reject) ->
      wilddogConfig.get "api"
      .then (data) ->
        opt =
          method:"GET"
          url:"http://#{data.host}:#{data.port}/mobile/product/#{id}/detail"
          json:true
        request opt,(err,response,body) ->
          resolve body
      .catch (err)->
        reject err

  @commentStat:(id) ->
    new Promise (resolve,reject) ->
      wilddogConfig.get "api"
      .then (data) ->
        opt =
          method:"GET"
          url:"http://#{data.host}:#{data.port}/mobile/product/comment/stat"
          json:true
          qs:
            product:id
        request opt,(err,response,body) ->
          resolve body
      .catch (err)->
        reject err

  @detailComments:(id) ->
    new Promise (resolve,reject) ->
      wilddogConfig.get "api"
      .then (data) ->
        opt =
          method:"GET"
          url:"http://#{data.host}:#{data.port}/mobile/product/comment/list"
          json:true
          qs:
            product:id
            type:1
            page:0
            pageSize:3
        request opt,(err,response,body) ->
          resolve body
      .catch (err)->
        reject err
