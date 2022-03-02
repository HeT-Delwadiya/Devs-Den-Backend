const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
       {
              name: {
                     type: String
              },
              email: {
                     type: String,
                     required: true
              },
              message: {
                     type: String,
                     required: true,
                     trim: true
              },
              subject: {
                     type: String,
                     required: true,
                     trim: true
              }
       },
       { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);