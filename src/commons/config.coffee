Wilddog = require "wilddog"
wilddogConfig = require "./../config/wilddog.json"
module.exports =
class Config
  @isAuth = false
  constructor: ->
    @ref = new Wilddog wilddogConfig.host
    @auth (err,res)=>
      console.log err,res

  auth:(fn) ->
    @ref.authWithCustomToken wilddogConfig.key,(err,authData) =>
      if err?
        console.log "Login Failed!",err
        fn err
      else
        @isAuth = true
        fn null

  get:(path,fn) ->
    if process.env.NODE_ENV is "production"
      path = "res/#{path}"
    else
      path = "test/#{path}"
    child = @ref.child path
    if @isAuth
      child.once "value",(data) =>
        fn null,data.val()
    else
      @auth (err,res) =>
        if err?
          fn err
        else
          child.once "value",(data) =>
            fn null,data.val()
