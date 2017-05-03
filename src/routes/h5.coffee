# node 项目自身路由
express = require "express"
router = express.Router()
ProductCtrl = require "./../ctrl/productCtrl"
SeniorCardCtrl = require "./../ctrl/seniorCardCtrl"

router.get "/goods/gid/:gid",ProductCtrl.detail
router.get "/card/active/",SeniorCardCtrl.activePage
module.exports = router
