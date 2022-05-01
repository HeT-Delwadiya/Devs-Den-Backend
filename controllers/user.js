const User = require("../models/user");
const Company = require("../models/company");
const Group = require("../models/group");
const Post = require("../models/post");
const Message = require("../models/message");
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.getUserById = (req, res, next, id) => {
       User.findById(id)
              .populate("followers","_id name avatar")
              .populate("following","_id name avatar")
              .populate("followingCompanies","_id name avatar")
              .populate("posts","_id description imageUrl comments likes")
              .populate("groups","_id groupName groupLogo")
              .exec((err, user) => {
              if(err)
                     return res.status(400).json({error:err})
              else if(!user)
                     return res.json({Message:"User not found!"})
              else {
                     req.profile = user;
                     next();
              }
       });
}

exports.getUser = (req,res) => {
       req.profile.salt = undefined;
       req.profile.encry_password = undefined;
       req.profile.createdAt = undefined;
       req.profile.updatedAt = undefined;
       return res.json(req.profile);
}

exports.getAllUsers = (req, res) => {
       User.find({})
       .select("name field avatar following followingCompanies followers")
       .exec((err, users) => {
              if(err)
                     return res.status(400).json({error:"No developers found"});
              return res.json(users);
       });
}

exports.getUsersBySkill = (req, res) => {
       User.find({skills: { $elemMatch: {'$regex': req.body.skill, $options:'i'} }})
       .select("name field avatar following followingCompanies followers")
       .exec((err, users) => {
              if(err)
                     return res.status(400).json({error:"No developers found with this skills"});
              return res.json(users);
       });
}

exports.getUsersByName = (req, res) => {
       User.find({name: {'$regex': req.body.name, $options:'i'} })
       .select("name field avatar following followingCompanies followers")
       .exec((err, users) => {
              if(err)
                     return res.status(400).json({error:"No developers found with this name"});
              return res.json(users);
       });
}

exports.getFollowers = (req, res) => {
       return res.json(req.profile.followers)
}

exports.getFollowings = (req, res) => {
       return res.json(req.profile.following)
}

exports.getUserByEmail = (req, res) => {
       let type = req.body.type;
       let email = req.body.email;
       if(type) {
              Company.findOne({email}, (err, user) => {
                     if(err)
                            return res.status(400).json({error:err});
                     else if (user)
                            return res.json({Message: "Company with this email already exists!"})  
                     else
                            return res.json({log: 1})   
              })
       } else {
              User.findOne({email}, (err, user) => {
                     if(err)
                            return res.status(400).json({error:err});
                     else if (user)
                            return res.json({Message: "User with this email already exists!"})  
                     else
                            return res.json({log: 1})   
              })
       }
}

exports.updateUser = (req,res) => {
       User.findByIdAndUpdate(
              {_id: req.profile._id},
              {$set: req.body},
              {new: true, useFindAndModify: false},
              (err, user) => {
                     if(err)
                     return res.status(400).json({error:"You are not authorized to update the info!"});
                     user.salt = undefined;
                     user.encry_password = undefined;
                     user.createdAt = undefined;
                     user.updatedAt = undefined;
                     res.json(user);
       })
}

exports.followUser = (req, res) => {

       if(req.body.userType==1) {
              User.findByIdAndUpdate(
                     {_id: req.body.mUserId},
                     {$push: {followingCompanies: req.body.userId}},
                     {new: true},
                     (err, user) => {
                     if(err)
                            return res.status(400).json({error:"Failed to add user to your following list!"});
              })
       } else {
              User.findByIdAndUpdate(
                     {_id: req.body.mUserId},
                     {$push: {following: req.body.userId}},
                     {new: true},
                     (err, user) => {
                     if(err)
                            return res.status(400).json({error:"Failed to add user to your following list!"});
              })
       }
       

       if(req.body.userType==1) {
              Company.findByIdAndUpdate(
                     {_id: req.body.userId},
                     {$push: {followers: req.body.mUserId}},
                     {new: true},
                     (err, company) => {
                     if(err)
                            return res.status(400).json({error:"Failed to add you to company's followers list!"});
                     company.salt = undefined;
                     company.encry_password = undefined;
                     company.createdAt = undefined;
                     company.updatedAt = undefined;
                     res.json(company);
              })
       } else {
              User.findByIdAndUpdate(
                     {_id: req.body.userId},
                     {$push: {followers: req.body.mUserId}},
                     {new: true},
                     (err, user) => {
                     if(err)
                            return res.status(400).json({error:"Failed to add you to user's followers list!"});
                     user.salt = undefined;
                     user.encry_password = undefined;
                     user.createdAt = undefined;
                     user.updatedAt = undefined;
                     res.json(user);
              })
       }
}

exports.deleteUser = (req, res) => {
       const user = req.profile;
       var error;

       user.groups.map((grp) => {
              Group.findById(grp._id)
                     .exec((err, group) => {
                            if(err)
                                   error =  {error:"Failed to remove member from the group!"}
                            else {
                                   if(_.toString(group.groupadminId)==_.toString(user._id)) {
                                          Message.find({groupId: group._id}).remove((err, messages) => {
                                                 if(err)
                                                        error = {Message: "Failed to delete all messages of this group!"}
                                          })
                                          group.remove((err, group) => {
                                                        if(err)
                                                               error =  {error:"Failed to remove the group!"}
                                                 })
                                   }
                                   else {
                                          Group.findOneAndUpdate(
                                                 {_id: group._id},
                                                 {$pull: {groupMembers: user._id}},
                                                 {new: true})
                                                 .exec((err, g) => {
                                                        if(err)
                                                               error =  {error:"Failed to remove member from the group!"}
                                                 })
                                   }

                                   
                            }
                     })
       })

       user.posts.map((post) => {
              Post.findById(post._id)
                     .exec((err, p) => {
                            if(err)
                                   error = {error:"Failed to get the post!"}
                            p.remove((err, pst) => {
                                   if(err)
                                          error =  {error:"Failed to remove the post!"}
                            })
                     })
       })

       user.remove((err, user) => {
              if(err)
                     return res.status(400).json({error:error+err});
              res.json({message:"Successfully deleted "+user.name+"'s account."});
       });
}

exports.unfollowUser = (req, res) => {
       let indexToRemove = 0;
       let indexToRemove2 = 0;

       User.findById(req.body.mUserId)
              .exec((err, user) => {
              if(err)
                     return res.status(400).json({error:err})
              else if(!user)
                     return res.status(400).json({error:"User not found!"})
              else {
                     if (req.body.userType==1) {
                     user.followingCompanies.map((follows, index) => {
                            if (follows == req.body.userId) {
                                   return indexToRemove = index
                            }
                     })
                     user.followingCompanies.splice(indexToRemove, 1);
       
                     User.findByIdAndUpdate(
                            {_id: req.body.mUserId},
                            {$set: {followingCompanies: user.followingCompanies}},
                            {new: true},
                            (err, nuser) => {
                                   if(err)
                                          return res.status(400).json({error:"Failed to unfollow this user!"});
                     })
                     } else {
                     user.following.map((follows, index) => {
                            if (follows == req.body.userId) {
                                   return indexToRemove = index
                            }
                     })
                     user.following.splice(indexToRemove, 1);
       
                     User.findByIdAndUpdate(
                            {_id: req.body.mUserId},
                            {$set: {following: user.following}},
                            {new: true},
                            (err, nuser) => {
                                   if(err)
                                          return res.status(400).json({error:"Failed to unfollow this user!"});
                     })
                     }
              }
       });


       if (req.body.userType==1) {
              Company.findById(req.body.userId)
              .exec((err, company) => {
              if(err)
                     return res.status(400).json({error:err})
              else if(!company)
                     return res.status(400).json({error:"company not found!"})
              else {
                     company.followers.map((follower, index) => {
                     if (follower == req.body.mUserId) {
                            return indexToRemove2 = index
                     }
                     })
                     company.followers.splice(indexToRemove2, 1);

                     Company.findByIdAndUpdate(
                     {_id: req.body.userId},
                     {$set: {followers: company.followers}},
                     {new: true},
                     (err, ncompany) => {
                            if(err)
                                   return res.status(400).json({error:"Failed to unfollow this user!"});
                            ncompany.salt = undefined;
                            ncompany.encry_password = undefined;
                            ncompany.createdAt = undefined;
                            ncompany.updatedAt = undefined;
                            res.json(ncompany);
                     })
              }
       });

       } else {
              User.findById(req.body.userId)
              .exec((err, user) => {
                     if(err)
                            return res.status(400).json({error:err})
                     else if(!user)
                            return res.status(400).json({error:"user not found!"})
                     else {
                            user.followers.map((follower, index) => {
                            if (follower == req.body.mUserId) {
                                   return indexToRemove2 = index
                            }
                            })
                            user.followers.splice(indexToRemove2, 1);

                            User.findByIdAndUpdate(
                            {_id: req.body.userId},
                            {$set: {followers: user.followers}},
                            {new: true},
                            (err, newuser) => {
                                   if(err)
                                          return res.status(400).json({error:"Failed to unfollow this user!"});
                                   newuser.salt = undefined;
                                   newuser.encry_password = undefined;
                                   newuser.createdAt = undefined;
                                   newuser.updatedAt = undefined;
                                   res.json(newuser);
                            })
                     }
              });
       }
}

exports.verifyUser = (req, res) => {
       if(!req.profile.isVerified) {
              if(req.params.token==req.profile.token) {
                     User.findByIdAndUpdate(
                            {_id: req.profile._id},
                            {isVerified: true},
                            {new: true},
                            (err, user) => {
                            if(err)
                                   return res.status(400).json({error:"Failed to add user to your following list!"});
                            const authtoken = jwt.sign({ _id: user._id }, process.env.SECRET);
                            res.cookie("token", authtoken, { expiresIn: 60 * 60 * 9999});
                                   
                            const {_id, name, email, role, type, avatar, isVerified} = user;
                            return res.json({authtoken,user: {_id, name, email, role, type, avatar, isVerified}});
                     })
              } else {
                     return res.status(400).json({error:"Invalid verification link!"});
              }
       } else {
              return res.status(400).json({error:"This account is already verified! You can login to your account now."});
       }
}