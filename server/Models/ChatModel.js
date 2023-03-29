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
        ]
    },
    { timestamps : true }
)

module.exports = mongoose.model("Chat", ChatSchema)