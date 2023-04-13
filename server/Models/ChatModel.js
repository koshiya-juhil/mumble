const mongoose = require("mongoose")

const ChatSchema = mongoose.Schema(
    {
        chatName : { type : String, trim : true },
        isGroupChat : { type : Boolean, default : false },
        users : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Users"
            }
        ],
        latestMessage : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Messages"
        },
        groupAdmin : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Users"
            }
        ],
        isBlocked : { type : Boolean, default : false }
    },
    { timestamps : true }
)

module.exports = mongoose.model("Chat", ChatSchema)