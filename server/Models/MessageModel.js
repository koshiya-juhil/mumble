const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
    {
        message : {
            text : {
                type : String,
                required : true,
                trim : true,
            }
        },
        users : Array,
        sender : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Users",
            // tef : "User",
            required : true,
        },
        chatid : { type : mongoose.Schema.Types.ObjectId, ref : "Chat" },
        readBy : [
            { type : mongoose.Schema.Types.ObjectId, ref : "Users" }
        ]
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model("Messages", messageSchema)