const Chat = require("../Models/ChatModel")
const UserModel = require("../Models/UserModel")

// if chat exists returns chat otherwise creates new chat and return it
const accessChat = async (req, res) => {
    const { userId, loggedInUser } = req.body

    if(!userId){
        console.log("UserId param not sent with request")
        return res.sendStatus(400)
    }

    var isChat = await Chat.find({
        isGroupChat : false,
        $and : [
            { users : { $elemMatch : { $eq : loggedInUser } } },
            { users : { $elemMatch : { $eq : userId } } }
        ]
    })
    .populate("users", "-password")
    .populate("latestMessage")

    isChat = await UserModel.populate(isChat, {
        path : "latestMessage.sender",
        select : "username email avatarImage"
    })

    if(isChat.length > 0){
        res.send(isChat[0])
    }
    else {
        var chatData = {
            chatName : "sender",
            isGroupChat : false,
            users : [loggedInUser, userId]
        }

        try {
            const createdChat = await Chat.create(chatData)
            const FullChat = await Chat.findOne({ _id : createdChat._id }).populate(
                "users",
                "-password"
            )
            res.status(200).json(FullChat)
        }
        catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
}

// fetach chats of user
const fetchChats = async (req, res) => {
    const { loggedInUser } = req.body
    try {
        Chat.find({ users : { $elemMatch : { $eq  : loggedInUser } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt : -1 })
            .then(async (results) => {
                results = await UserModel.populate(results, {
                    path : "latestMessage.sender",
                    select : "username avatarImage email"
                })
                res.status(200).send(results)
            })
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
}

// list all group
const listGroups = async (req, res) => {
    try {
        Chat.find({ isGroupChat : true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt : -1 })
            .then(async (results) => {
                results = await UserModel.populate(results, {
                    path : "latestMessage.sender",
                    select : "username avatarImage email"
                })
                res.status(200).send(results)
            })
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
}

// create group chat 
const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    var users = JSON.parse(req.body.users)

    if(users.length < 2){
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat")
    }

    users.push(req.body.loggedInUser)

    try {
        const groupChat = await Chat.create({
            chatName : req.body.name,
            users : users,
            isGroupChat : true,
            groupAdmin : req.body.loggedInUser
        })

        const fullGroupChat = await Chat.findOne({ _id : groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).json(fullGroupChat)

    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
}

// rename group name
const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName : chatName,
        },
        {
            new : true
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    
    if(!updatedChat){
        res.status(404)
        throw new Error("Chat Not Found")
    }
    else {
        res.json(updatedChat)
    }
}

// add to group
const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body
    
    // check if requester is admin
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push : { users : userId }
        },
        {
            new : true
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    
    if(!added){
        res.status(404)
        throw new Error("Chat Not Found")
    }
    else {
        res.json(added)
    }
}

// remove from group
const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body
    
    // check if requester is admin
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull : { users : userId }
        },
        {
            new : true
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    
    if(!removed){
        res.status(404)
        throw new Error("Chat Not Found")
    }
    else {
        res.json(removed)
    }
}

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup, listGroups }