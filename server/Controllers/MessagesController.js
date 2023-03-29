const ChatModel = require("../Models/ChatModel")
const MessageModel = require("../Models/MessageModel")
const messageModal = require("../Models/MessageModel")
const UserModel = require("../Models/UserModel")

module.exports.addMessage = async (req, res, next) => {

    const { message, chatId, loggedInUser } = req.body

    if(!message || !chatId || !loggedInUser){
        console.log("Invalid data pased into request")
        return res.sendStatus(400)
    }

    var newMessage = {
        sender : loggedInUser,
        message : { text : message },
        chatid : chatId
    }

    try {
        var messagedata = await MessageModel.create(newMessage)

        messagedata = await messagedata.populate("sender", "username avatarImage")
        messagedata = await messagedata.populate("chatid")
        messagedata = await UserModel.populate(messagedata, {
            path : "chatid.users",
            select : "username email avatarImage"
        })

        await ChatModel.findByIdAndUpdate(loggedInUser, { latestMessage : messagedata })

        res.json(messagedata)

    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }

    // try {
    //     const { from, to, message } = req.body
    //     const data = await messageModal.create({
    //         message : { text : message },
    //         users : [from, to],
    //         sender : from,
    //     })

    //     if(data) {
    //         return res.json({ msg : "Message added successfully." })
    //     } 
    //     else {
    //         return res.json({ msg : "failed to add message to the database" })
    //     }
    // }
    // catch (ex) {
    //     next(ex)
    // }
}

module.exports.getAllMessage = async (req, res, next) => {
    try {
        const { chatId, loggedInUser } = req.body
        const messages = await messageModal.find({
            chatid : chatId
        }).sort({ updatedAt : 1 })
            .populate("sender", "username email avatarImage")
            .populate("chatid")

        // const projectedMessages = messages.map((msg) => {
        //     return {
        //         fromSelf : msg.sender._id.toString() === loggedInUser,
        //         message : msg.message.text,
        //         sender : msg.sender,
        //         chat : msg.chatid
        //     }
        // })

        return res.json(messages)
    }
    catch(ex) {
        next(ex)
    }

    // try {
    //     const { from, to } = req.body
    //     const messages = await messageModal.find({
    //         users : {
    //             $all : [from, to],
    //         }
    //     }).sort({ updatedAt : 1 })

    //     const projectedMessages = messages.map((msg) => {
    //         return {
    //             fromSelf : msg.sender.toString() === from,
    //             message : msg.message.text,
    //         }
    //     })

    //     return res.json(projectedMessages)
    // }
    // catch(ex) {
    //     next(ex)
    // }
}