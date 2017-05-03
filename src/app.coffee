express = require('express')
subdomain = require "express-subdomain"
path = require('path')
favicon = require('serve-favicon')
log4js = require('log4js')
session = require "express-session"
cookieParser = require('cookie-parser')
bodyParser = require('body-parser')
RedisStore = require("connect-redis")(session)

global.Redis = require('./db/redis')
WilddogConfig = require('./model/config')
global.wilddogConfig = new WilddogConfig
global.wilddogConfig.auth (err) ->
  if err
    console.error err
log4js.configure
  appenders: [
    { type: 'console' }
  ]
  replaceConsole: true
logger = log4js.getLogger('normal')

routes = require('./routes/index')
qqAuth = require "./routes/qq"
weiboAuth = require "./routes/weibo"
weixinAuth = require "./routes/weixin"
weixinDistribute = require "./routes/weixinDistribute"
api = require "./routes/api"
h5 = require "./routes/h5"
share = require "./routes/share"
AuthCtrl = require "./ctrl/authCtrl"

app = express()
# view engine setup
app.set 'views', path.join(__dirname, 'views')
app.set 'view engine', 'ejs'
app.enable 'trust proxy'
# uncomment after placing your favicon in /public
#app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use bodyParser.json()
app.use bodyParser.urlencoded(extended: false)
app.use cookieParser("meiwan")

console.log "------env------",app.get "env"

switch app.get "env"
  when "production"
    app.set "domain",".beautysite.cn"
    app.use express.static(path.join(__dirname, 'public/dist'))
    redisconfig = require('./config/redis.json')
  when "dev"
    app.set "domain",".meiwan.me"
    redisconfig = require('./config/test/redis.json')
    app.use express.static(path.join(__dirname, '../src/public/dev'))
  else
    app.set "domain",".meiwan.me"
    redisconfig = require('./config/test/redis.json')
    app.use express.static(path.join(__dirname, 'public/dist'))
app.use express.static(path.join(__dirname, 'asst'))
app.use session(
  store:new RedisStore
    host:redisconfig.host
    db:2
    pass:redisconfig.password
  resave:false
  saveUninitialized:false
  secret:"meiwan"
)
app.use log4js.connectLogger(logger, level: log4js.levels.INFO)
app.use subdomain("dist",weixinDistribute)

app.use "/share",share
app.use AuthCtrl.setBackUrl
app.use "/auth/weibo", weiboAuth
app.use "/auth/qq", qqAuth
app.use "/auth/weixin", weixinAuth

app.use AuthCtrl.checkIsWeixin
app.use "/h5",h5
app.use "/", routes
app.use "/api",api

app.use "/v/*",(req, res, next) ->
  res.render "v/index"

# catch 404 and forward to error handler
app.use (req, res, next) ->
  res.render "index"
  # err = new Error('Not Found')
  # err.status = 404
  # next err

# error handlers
# development error handler
# will print stacktrace
if app.get('env') == 'development'
  app.use (err, req, res, next) ->
    res.status err.status or 500
    res.render 'error',
      message: err.message
      error: err

# production error handler
# no stacktraces leaked to user
app.use (err, req, res, next) ->
  res.status err.status or 500
  res.render 'error',
    message: err.message
    error: {}

module.exports = app