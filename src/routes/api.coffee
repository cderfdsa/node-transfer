# 转发到后端 api 接口
express = require "express"
Proxy = require "./../proxy/index"
AuthCtrl = require "./../ctrl/authCtrl"
router = express.Router()
router.get "/code",AuthCtrl.getCode
router.post "/member/loginCode",Proxy.loginCode
router.use Proxy.forward
module.exports = router
