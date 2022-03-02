require('dotenv').config()
const Group = require("../models/group");
const User = require("../models/user");
const Message = require("../models/message");
const uuidv1  = require("uuid");

exports.getGroupById = (req, res, next, id) => {
       Group.findById(id)
       .populate("groupMembers","name avatar")
       .exec((err, group) => {
              if(err)
                     return res.status(400).json({error:err})
              else if(!group)
                     return res.status(404).json({error:"Group not found!"})
              else {
                     req.group = group;
                     next();
              }
       });
}

exports.createGroup = (req, res) => {
       const group = new Group(req.body);

       group.save((err, nGroup) => {
              if(err) {
                     return res.status(400).json({error:"Not able to create the group!"});
              }

              User.findByIdAndUpdate(
                     {_id: nGroup.groupadminId},
                     {$push: {groups: nGroup._id}},
                     {new: true},
                     (err, user) => {
                            if(err)
                                   return res.status(400).json({error:"Failed to save the group!"});
              })

              Group.findByIdAndUpdate(
                     {_id: nGroup._id},
                     {$set: {groupInviteLink: process.env.FRONTEND_URL+"group/"+nGroup._id+"/join/"+uuidv1()}},
                     {new: true},
                     (err, fGroup) => {
                            if(err)
                            return res.status(400).json({error:"Failed to set invite link of the group!"});
                            res.json(fGroup);
              })
       });
}

exports.getGroup = (req, res) => {
       return res.json(req.group);
}

exports.updateGroup = (req, res) => {
       Group.findByIdAndUpdate(
              {_id: req.group._id},
              {$set: req.body},
              {new: true},
              (err, group) => {
                     if(err)
                     return res.status(400).json({error:"Failed to update the group!"});
                     res.json(group);
       })
}

exports.addMemberToGroup = (req, res) => {
       Group.findByIdAndUpdate(
              {_id: req.group._id},
              {$push: {groupMembers: req.body.userId}},
              {new: true},
              (err, group) => {
                     if(err)
                            return res.status(400).json({error:"Failed to add member to the group!"});
                     
                     User.findByIdAndUpdate(
                            {_id: req.body.userId},
                            {$push: {groups: req.group._id}},
                            {new: true},
                            (err, user) => {
                                   if(err)
                                          return res.status(400).json({error:"Failed to add new group in user's database!"});
                                   res.json(group);
                     })
       })
}

exports.deleteGroup = (req, res) => {
       const group = req.group;

       if(group.groupadminId==req.body.adminId) {

              group.groupMembers.map((user) => {
                     User.findByIdAndUpdate(
                            {_id: user._id},
                            {$pull: {groups: group._id}},
                            {new: true},
                            (err, nUser) => {
                                   if(err)
                                          return res.status(400).json({error:"Failed to remove the user from group!"});
                            })
              })

              Message.find({groupId: group._id}).remove((err, messages) => {
                     if(err)
                            return res.status(500).json({Message: "Failed to delete all messages of this group!"})
              })

              group.remove((err, rGroup) => {
                     if(err)
                            return res.status(400).json({error:"Failed to delete the group"});
                     res.json({message:"Group deleted successfully"});
              });

       }
}

exports.removeMemberFromGroup = (req, res) => {
       if(req.group.groupadminId==req.body.adminId) {
              Group.findOneAndUpdate(
                     {_id: req.group._id},
                     {$pull: {groupMembers: req.body.userId}},
                     {new: true})
                     .populate("groupMembers","name avatar")
                     .exec((err, group) => {
                            if(err)
                                   return res.status(400).json({error:"Failed to add member to the group!"});

                            User.findByIdAndUpdate(
                                   {_id: req.body.userId},
                                   {$pull: {groups: req.group._id}},
                                   {new: true},
                                   (err, nUser) => {
                                          if(err)
                                                 return res.status(400).json({error:"Failed to remove the user from group!"});
                                   })
                            return res.json(group);
              })
       } else {
              return res.json({Message: "Only admin can remove member from the group!"});
       }
       
}