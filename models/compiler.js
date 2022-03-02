const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const compilerSchema = new mongoose.Schema(
       {
              user: {
                     type: ObjectId,
                     ref: "User"
              },
              code: {
                     type: String,
                     required: true
              },
              lang: {
                     type: String,
                     required: true
              },
              input: {
                     type: String,
              }
       },
       { timestamps: true }
);

module.exports = mongoose.model("Compiler", compilerSchema);