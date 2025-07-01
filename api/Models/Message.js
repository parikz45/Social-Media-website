const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    text:{
        type:String,
    },
    conversationId:{
        type:String,
    },
    sender:{
        type:String,
    },
  },
  {timestamps:true}
);

module.exports = mongoose.model("Message", MessageSchema);
