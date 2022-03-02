const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const conversationSchema = new mongoose.Schema(
       {
              members: [{}],
              isGroup: {
                     type: Boolean,
                     default: false
              }
       },
       { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
