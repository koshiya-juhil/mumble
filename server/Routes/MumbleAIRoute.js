const { getData, sendData } = require("../Controllers/MumbleAIController")

const router = require("express").Router()

router.route("/").get(getData)
router.route("/").post(sendData)

module.exports = router