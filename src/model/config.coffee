Wilddog = require "wilddog"
jwt = require "jsonwebtoken"
wilddogConfig = require "./../config/wilddog.json"
moment = require "moment"
Promise = require "bluebird"
_ = require "lodash"

module.exports =
class Config
  constructor: ->
    @isAuth = false
    @expire = 0
    @ref = new Wilddog wilddogConfig.host
    @isRes = process.env.NODE_ENV is "production"
    @auth (err,res)->

  auth:(fn) ->
    @ref.authWithCustomToken wilddogConfig.key,(err,authData) =>
      if err?
        console.log "Login Failed!",err
        fn err
      else
        console.log "Login Success!"
        @isAuth = true
        key = "system:config"
        @ref.on "child_changed",(snapshot) =>
          @ref.once "value",(data) =>
            Redis.set key,new Buffer(JSON.stringify(data.val())).toString("base64")
        fn null

  _getValue = (data,path,isRes) ->
    if isRes
      data.res[path]
    else
      if _.has data.test,path
        data.test[path]
      else
        data.res[path]

  get:(path) ->
    new Promise (resolve,reject) =>
      key = "system:config"
      Redis.getAsync key
      .then (data) =>
        if data?
          console.log "从缓存中获取#{path}"
          data = JSON.parse new Buffer(data,"base64").toString()
          resolve _getValue(data,path,@isRes)
        else
          console.log "没有缓存,从野狗获取#{path}"
          if @expire < moment().valueOf()
            @isAuth = false
          if @isAuth
            @ref.once "value",(data) =>
              Redis.set key,new Buffer(JSON.stringify(data.val())).toString("base64")
              resolve _getValue(data.val(),path,@isRes)
          else
            @auth (err,res) =>
              if err?
                reject err
              else
                @ref.once "value",(data) =>
                  Redis.set key,new Buffer(JSON.stringify(data.val())).toString("base64")
                  resolve _getValue(data.val(),path,@isRes)
