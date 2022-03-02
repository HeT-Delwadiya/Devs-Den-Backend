const Conversation = require("../models/conversation");
const Message = require("../models/message");

exports.getConversationById = (req, res, next, id) => {
       Conversation.findById(id)  
       .exec((err, conversation) => {
              if(err)
                     return res.status(400).json({error:err})
              else if(!conversation)
                     return res.status(404).json({error:"Conversation not found!"})
              else {
                     req.conversation = conversation;
                     next();
              }
       });
}

exports.getConversation = (req, res) => {
       return res.json(req.conversation);
}

exports.createConversation = (req, res) => {
       const conversation = new Conversation(req.body);

       conversation.save((err, conver) => {
              if(err)
                     return res.status(500).json(err);
              return res.json(conver);
       })
}

exports.getAllConversations = (req, res) => {
       Conversation.find({members: req.body.userId}, (err, conversations) => {
              if(err) {
                     return res.status(500).json(err);
              }
              else if(!conversations)
                     return res.json({Message:"No conversations found!"});
              else {
                     return res.json(conversations);
              }
       })
}

exports.getConversationByMemberId = (req, res) => {
       var foundCon; 
       Conversation.find({members: {$in: req.body.userId && req.body.otherId}, isGroup: {$eq: false}}, (err, conversations) => {
              if(err) {
                     return res.status(500).json(err);
              }
              else if(!conversations)
                     return res.json({Message:"No conversations found!"});
              else {
                     conversations.map((con) => {
                            if(con.members.includes(req.body.userId) && con.members.includes(req.body.otherId))
                                   return foundCon = con;
                     })
                     return foundCon ? res.json(foundCon) : res.json({Message:"No conversations found!"});
              }
       })
}

exports.deleteConversation = (req, res) => {
       const conversation = req.conversation;

       conversation.remove((err, rConversation) => {
              if(err)
                     return res.status(500).json(err);
       })

       Message.find({conversationId: req.conversation._id}).remove((err, messages) => {
              if(err)
                     return res.status(500).json(err);
              return res.json({Message: "Conversation deleted successfully with "+messages.length+" messages!"});
       })
}