const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
       {
       description: {
              type: String,
              required: true,
              maxlength: 256
       },
       user: {
              type: ObjectId,
              refPath: "userType"
       },
       userType: {
              type: String,
              required: true,
              enum: ['User', 'Company']
       },
       imageUrl: {
              type: String,
              trim: true
       },
       comments: [{}],
       likes: [{
              type: ObjectId,
              refPath: "User"
       }]
       },
       { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
