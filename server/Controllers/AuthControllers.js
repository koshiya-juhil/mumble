const User = require("../Models/UserModel")
const bcrypt = require("bcrypt")
// const jwt = require("jsonwebtoken")

// const maxAge = 3 * 24 * 60 * 60

// const createToken = (id) => {
//     return jwt.sign({ id }, "juhil secret key", {
//         expiresIn: maxAge,
//     })
// }

// const handleErrors = (err) => {
//     let errors = { password: "", username: "" }

//     if(err.message === 'incorrectusername') {
//         errors.username = "User not registered"
//     }

//     if(err.message === 'incorrectpassword') {
//         errors.username = "Password is incorrect"
//     }

//     // if(err.code === 11000){
//     //     errors.email = "Email is Already Registered"
//     //     return errors
//     // }

//     if(err.message.includes("Users validation failed")) {
//         Object.values(err.errors).forEach(({ properties }) => {
//             errors[properties.path] = properties.message
//         })
//     }
//     return errors
// }

module.exports.signup = async (req, res, next) => {
    try {
        const { email, password, username } = req.body 
        const userCheck = await User.findOne({ username })
        if(userCheck){
            return res.json({ msg:"Username already exist", status: false })
        }

        const emailCheck = await User.findOne({ email })
        if(emailCheck){
            return res.json({ msg: "Email already exist", status: false })
        }

        const hashedpassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            email, username, password: hashedpassword
        })
        delete user.password
        return res.json({ status: true, user })

    } catch (ex) {
        next(ex)
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { password, username } = req.body 
        const user = await User.findOne({ username })
        if(!user){
            return res.json({ msg:"Incorrect Username", status: false })
        }
        
        if(user.status == "blocked"){
            return res.json({ msg:"Your account is suspended, please contact administrator to activate account", status: false })
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return res.json({ msg:"Incorrect Password", status: false })
        }
        delete user.password
        
        return res.json({ status: true, user })

    } catch (ex) {
        next(ex)
    }
}

module.exports.adminLogin = async (req, res, next) => {
    try {
        const { password, username } = req.body 
        const user = await User.findOne({ username })
        if(!user || user.isAdmin || user.isAdmin == false){
            return res.json({ msg:"Incorrect Username", status: false })
        }
    

        if(user.isAdmin == true){
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if(!isPasswordValid){
                return res.json({ msg:"Incorrect Password", status: false })
            }
            delete user.password
            
            return res.json({ status: true, user })
        }
        else {
            return res.json({msg:"Incorrect User", status: false})
        }
        

    } catch (ex) {
        next(ex)
    }
}

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id 
        const avatarImage = req.body.image 
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        })
        return res.json({
            isSet : userData.isAvatarImageSet,
            image : userData.avatarImage
        })
    } catch (ex) {
        next(ex)
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id : { $ne : req.params._id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
            "status",
            "isAvatarImageSet"
        ])
        return res.json(users)
    }
    catch(ex) {
        next(ex)
    }
}