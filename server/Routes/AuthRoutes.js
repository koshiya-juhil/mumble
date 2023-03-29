const { signup, login, setAvatar, getAllUsers } = require("../Controllers/AuthControllers")

const router = require("express").Router()

// router.post("/")
router.post("/signup", signup)
router.post("/login", login)
router.post("/setavatar/:id", setAvatar)
router.get("/allusers/:id", getAllUsers)

module.exports = router