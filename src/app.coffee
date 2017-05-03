express = require 'express'
subdomain = require 'express-subdomain'
path = require 'path'
favicon = require 'serve-favicon'
log4js = require 'log4js'
session = require 'express-session'
cookieParser = require 'cookie-parser'
bodyParser = require 'body-parser'
RedisStore = require('connect-redis')(session)
WilddogConfig = require './model/config'

# global
global.Redis = require './db/redis'
global.wilddogConfig = new WilddogConfig
global.wilddogConfig.auth (err) ->
	if err
		console.error err

# 日志
log4js.configure
	appenders: [
		{ type: 'console' }
	]
	replaceConsole: true
logger = log4js.getLogger('normal')

# express 相关设置
app = express()
# view engine setup
app.set 'views', path.join(__dirname, 'views')
app.set 'view engine', 'ejs'
app.enable 'trust proxy'
# uncomment after placing your favicon in /public
#app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use bodyParser.json()
app.use bodyParser.urlencoded(extended: false)
# 带有签名的cookie
app.use cookieParser("meiwan")
# app.use express.static(path.join(__dirname, 'static'))
app.use log4js.connectLogger(logger, level: log4js.levels.INFO)

weixinDistribute = require './routes/weixinDistribute'
app.use subdomain("dist", weixinDistribute)

# 路由
routes = require './routes/index'
qqAuth = require './routes/qq'
weiboAuth = require './routes/weibo'
weixinAuth = require './routes/weixin'
api = require './routes/api'
AuthCtrl = require './ctrl/authCtrl'

# 路由分发，授权
app.use AuthCtrl.setBackUrl
app.use "/auth/weibo", weiboAuth
app.use "/auth/qq", qqAuth
app.use "/auth/weixin", weixinAuth

app.use AuthCtrl.checkIsWeixin
app.use "/", routes
app.use "/api", api

# 根据环境配置
console.log "------env------", app.get "env"
switch app.get "env"
	when "production"
		app.set "domain",".beautysite.cn"
		app.use express.static(path.join(__dirname, 'public'))
		redisconfig = require('./config/redis.json')
	when "dev"
		app.set "domain",".meiwan.me"
		redisconfig = require('./config/redis.json').test
		app.use express.static(path.join(__dirname, '../src/public'))
	else
		app.set "domain",".meiwan.me"
		redisconfig = require('./config/redis.json').test
		app.use express.static(path.join(__dirname, 'public'))

app.use session(
	store: new RedisStore
		host: redisconfig.host
		db:2
		pass: redisconfig.password
	resave: false
	saveUninitialized: false
	secret: "meiwan"
)

# catch 404 and forward to error handler
app.use (req, res, next) ->
	res.render "index"
	# 404 在前端返回
	# err = new Error('Not Found')
	# err.status = 404
	# next err

# error handlers
# development error handler: will print stacktrace
if app.get('env') == 'development'
	app.use (err, req, res, next) ->
		res.status err.status or 500
		res.render 'error',
			message: err.message
			error: err

# production error handler: no stacktraces leaked to user
app.use (err, req, res, next) ->
	res.status err.status or 500
	res.render 'error',
		message: err.message
		error: {}

module.exports = app
