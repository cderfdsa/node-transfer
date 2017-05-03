###*
# Created by zl on 15-11-26.
###

bluebird = require('bluebird')
redis = require('redis')
bluebird.promisifyAll redis.RedisClient.prototype
bluebird.promisifyAll redis.Multi.prototype
redisconfig = undefined
if process.env.NODE_ENV == 'production'
  redisconfig = require('./../config/redis.json')
else
  redisconfig = require('./../config/test/redis.json')
client = redis.createClient(redisconfig.port, redisconfig.host,
  auth_pass: redisconfig.password
  prefix: 'mw:')
exports = module.exports = client
