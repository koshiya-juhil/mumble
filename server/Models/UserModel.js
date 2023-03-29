const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50
    },
    password: {
        type: String,
        required: true,
        // min: 8
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false
    },
    avatarImage: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    }
})
// mongoose.set('strictQuery', false)
// userSchema.pre("save", async function(next) {
//     const salt = await bcrypt.genSalt()
//     this.password = await bcrypt.hash(this.password, salt)
//     next()
// })

// userSchema.static.login = async function (username, password) {
//     const user = await this.findOne({ username })
//     if(user){
//         const auth = await bcrypt.compare(password, user.password)
//         if(auth){
//             return user
//         }
//         throw Error("incorrectpassword")
//     }
//     throw Error("incorrectusername")
// }

module.exports = mongoose.model("Users", userSchema)