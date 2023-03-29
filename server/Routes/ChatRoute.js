const { accessChat, fetchChats, createGroupChat, updateGroup, addToGroup, removeFromGroup } = require("../Controllers/ChatController")

const router = require("express").Router()

router.route("/").post(accessChat)
router.route("/list").post(fetchChats)
router.route("/group").post(createGroupChat)
router.route("/group/rename").put(updateGroup)
router.route("/group/add").put(addToGroup)
router.route("/group/remove").put(removeFromGroup)

module.exports = router