const Message = require("../models/message");

exports.getMessageById = (req, res) => {
       Message.findById(id)  
       .exec((err, message) => {
              if(err)
                     return res.status(400).json({error:err})
              else if(!post)
                     return res.status(404).json({error:"Message not found!"})
              else {
                     req.message = message;
                     next();
              }
       });
}

exports.getMessage = (req, res) => {
       return res.json(req.message);
}

exports.createMessage = (req, res) => {
       const message = new Message(req.body);

       message.save((err, msg) => {
              if(err)
                     return res.status(500).json(err);
              return res.json(msg);
       })
}

exports.getMessagesOfConversation = (req, res) => {
       Message.find({conversationId: req.body.conversationId}, (err, messages) => {
              if(err)
                     return res.status(500).json(err);
              else if(!messages)
                     return res.json({Message:"No messages found!"});
              else {
                     return res.json(messages);
              }
       })
}

exports.getMessagesOfGroup = (req, res) => {
       Message.find({groupId: req.body.groupId})
       .populate("senderId", "name avatar", "User")
       .exec((err, messages) => {
              if(err)
                     return res.status(500).json(err);
              else if(!messages)
                     return res.json({Message:"No messages found!"});
              else {
                     return res.json(messages);
              }
       })
}

exports.deleteMessage = (req, res) => {
       const message = req.message;

       message.remove((err, rMsg) => {
              if(err)
                     return res.status(500).json(err);
              return res.json(rMsg);
       })
}