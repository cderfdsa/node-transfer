express = require "express"
router = express.Router()
ShareCtrl = require "./../ctrl/shareCtrl"

router.get "*",ShareCtrl.share

module.exports = router
