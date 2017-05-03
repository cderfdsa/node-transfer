_ = require "lodash"
Promise = require "bluebird"
request = require "request"

switch process.env.NODE_ENV
	when "production"
		config = require "./../config/proxy.json"
	when "dev"
		config = require("./../config/proxy.json").dev
	else
		config = require("./../config/proxy.json").test

module.exports =
class Proxy
	_checkIgnoreUrl = (url) ->
		new Promise (resolve,reject) ->
			key = "roles:web"
			Redis.sismemberAsync key,url
			.then (res) ->
				resolve not res>0
			.catch (err) ->
				reject err

	_403 = () ->
		err = new Error "403 Forbidden"
		err.status = 403
		err

	@loginCode:(req, res, next)->
		code = req.body.code
		if code.toUpperCase() is req.session.code
			req.session.code = null
			next()
		else
			res.json
				err:1
				errMsg:"图形验证码错误"

	@forward:(req, res, next)->
		if req.xhr or req.app.get("env") isnt "production"
		# if true
			_checkIgnoreUrl req.path
			.then (checked) ->
				if checked
					if not req.query.token?
						req.query.token = req.cookies.user_login_token
					agent = req.get('User-Agent')
					options =
						url: config.host + req.path
						method: req.method
						qs: req.query
						gzip: true
						headers:
							"User-Agent":agent
							"X-Forwarded-For":req.ip
					if req.is('json')
						options.json = true
						options.body = req.body
					if req.is('urlencoded')
						options.form = req.body
					request(options).pipe res
				else
					next _403()
			.catch (err) ->
				console.log('ERR', err)
				next _403()
		else
			next _403()
