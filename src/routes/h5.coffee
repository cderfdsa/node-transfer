express = require "express"
router = express.Router()
ProductCtrl = require "./../ctrl/productCtrl"
SpecialCtrl = require "./../ctrl/specialCtrl"
SeniorCardCtrl = require "./../ctrl/seniorCardCtrl"

router.get "/specialDetail/product/:sid",SpecialCtrl.detail
router.get "/goods/gid/:gid",ProductCtrl.detail
router.get "/card/active/",SeniorCardCtrl.activePage
module.exports = router
