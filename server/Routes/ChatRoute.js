const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup, listGroups } = require("../Controllers/ChatController")

const router = require("express").Router()

router.route("/").post(accessChat)
router.route("/list").post(fetchChats)
router.route("/group/list").post(listGroups)
router.route("/group").post(createGroupChat)
router.route("/group/rename").put(renameGroup)
router.route("/group/add").put(addToGroup)
router.route("/group/remove").put(removeFromGroup)

module.exports = router