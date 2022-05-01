const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
const { ObjectId } = mongoose.Schema;

let companySchema = new mongoose.Schema({
       type: {
              type: Number,
              required: true,
              default: 1
       },
       name: {
              type: String,
              required: true,
              maxlength: 32,
              trim:true
       },
       email: {
              type: String,
              trim: true,
              required: true,
              unique: true
       },
       avatar: {
              type: String,
              trim: true,
              default: "https://res.cloudinary.com/dev-s-den/image/upload/v1641874500/6ebeb771b8714f3cc70c8da7c1308c11_kofinb.jpg" 
       },
       size: {
              type: String,
              required: true,
              enum: ["Select company size","0-1 employees","2-10 employees","11-50 employees","51-200 employees","200+ employees"]
       },
       founded: {
              type: Number
       },
       website: {
              type: String,
              trim: true
       },
       location: {
              type: String,
              required: true,
              trim: true
       },
       specialities: [{
              type: String,
              trim: true,
              required: true
       }],
       bio: {
              type: String,
              trim: true,
              required: true
       },
       socials: {},
       followers: [{
              type: ObjectId,
              ref: "User"
       }],
       posts: [{
              type: ObjectId,
              ref: "Post"
       }],
       encry_password: {
              type: String,
              required: true
       },
       salt: String,
       role: {
              type: Number,
              default: 1
       },
       isVerified: {
              type: Boolean,
              default: false
       },
       token: {
              type: String
       }
},{ timestamps: true });

companySchema
       .virtual("password")
       .set(function(password){
              this._password = password;
              this.salt = uuidv1();
              this.encry_password = this.securePassword(password);
       })
       .get(function(){
              return this._password;
       })

companySchema.methods = {

       authenticate: function(plainpassword) {
              return this.securePassword(plainpassword) === this.encry_password
       },

       securePassword: function(plainpassword) {
              if(!plainpassword) return "";
              try {
                     return crypto
                     .createHmac('sha256', this.salt)
                     .update(plainpassword)
                     .digest('hex');
              } catch(err) {
                     return "";
              } 
       }
};

module.exports = mongoose.model("Company", companySchema);