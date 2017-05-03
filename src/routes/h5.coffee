# node 项目自身路由
express = require "express"
router = express.Router()
SeniorCardCtrl = require "./../ctrl/seniorCardCtrl"

router.get "/card/active/",SeniorCardCtrl.activePage
module.exports = router
