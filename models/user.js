const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
const { ObjectId } = mongoose.Schema;

let userSchema = new mongoose.Schema({
       type: {
              type: Number,
              required: true,
              default: 0
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
       userinfo: {
              type: String,
              trim: true
       },
       avatar: {
              type: String,
              trim: true,
              default: "https://res.cloudinary.com/dev-s-den/image/upload/v1641874500/6ebeb771b8714f3cc70c8da7c1308c11_kofinb.jpg"
       },
       field: {
              type: String,
              required: true,
              enum: ["Software Developer","Web Developer","AI Specialist","Data Scientist","FrontEnd Developer","BackEnd Developer","Full Stack Developer","UI/UX Designer","Mobile App Developer","Game Developer","Cyber Security Specialist"]
       },
       company: {
              type: String,
              trim: true
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
       skills: [],
       github: {
              type: String,
              trim: true
       },
       bio: {
              type: String,
              trim: true,
              required: true
       },
       followers: [{
              type: ObjectId,
              ref: "User"
       }],
       following: [{
              type: ObjectId,
              ref: "User"
       }],
       followingCompanies: [{
              type: ObjectId,
              ref: "Company"
       }],
       posts: [{
              type: ObjectId,
              ref: "Post"
       }],
       socials: {},
       education: {},
       experience: {},
       groups: [{
              type: ObjectId,
              ref: "Group"
       }],
       encry_password: {
              type: String,
              required: true
       },
       salt: String,
       role: {
              type: Number,
              default: 0
       },
       isVerified: {
              type: Boolean,
              default: false
       },
       token: {
              type: String
       }
},{ timestamps: true });

userSchema
       .virtual("password")
       .set(function(password){
              this._password = password;
              this.salt = uuidv1();
              this.encry_password = this.securePassword(password);
       })
       .get(function(){
              return this._password;
       })

userSchema.methods = {

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

module.exports = mongoose.model("User", userSchema);