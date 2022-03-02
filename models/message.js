const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const messageSchema = new mongoose.Schema(
       {
              conversationId: {
                     type: String
              },
              senderId: {
                     type: String,
                     required: true
              },
              text: {
                     type: String,
                     required: true,
                     trim: true
              },
              isGroup: {
                     type: Boolean,
                     default: false
              },
              groupId: {
                     type: String
              }
       },
       { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
