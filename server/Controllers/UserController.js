const User = require("../Models/UserModel")

// update user
module.exports.updateUser = async (req, res) => {
    const  newData  = req.body

    console.log(newData, "----------------------------------")

    const updatedUser = await User.findByIdAndUpdate(
        {"_id" :newData._id},
        {
            status : newData.status,
            username : newData.username,
            avatarImage : newData.avatarImage,
            email : newData.email
        },
        {
            new : true
        }
    )
    
    if(!updatedUser){
        res.status(404)
        throw new Error("User Not Found")
    }
    else {
        res.status(200)
        res.json(updatedUser)
    }
}

// delete user
module.exports.deleteUser = async (req, res) => {
    const data = req.body

    const deletedUser = await User.deleteOne({_id: data.userid})

    console.log(deletedUser)

    res.json("User Deleted Success")
}