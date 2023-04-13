const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup, listGroups, updateGroup, deleteGroup } = require("../Controllers/ChatController")

const router = require("express").Router()

router.route("/").post(accessChat)
router.route("/list").post(fetchChats)
router.route("/group/list").post(listGroups)
router.route("/group").post(createGroupChat)
router.route("/group/rename").put(renameGroup)
router.route("/group/add").put(addToGroup)
router.route("/group/remove").put(removeFromGroup)
router.route("/group/updategroup").put(updateGroup)
router.route("/group/delete").delete(deleteGroup)

module.exports = router