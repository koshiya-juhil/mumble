const router = require("express").Router()
const { updateUser, deleteUser } = require("../Controllers/UserController")

router.route("/update").put(updateUser)
router.route("/delete").delete(deleteUser)

module.exports = router