const { signup, login, setAvatar, getAllUsers, adminLogin } = require("../Controllers/AuthControllers")

const router = require("express").Router()

// router.post("/")
router.post("/signup", signup)
router.post("/login", login)
router.post("/setavatar/:id", setAvatar)
router.get("/allusers/:id", getAllUsers)

router.post("/admin/login", adminLogin)

module.exports = router