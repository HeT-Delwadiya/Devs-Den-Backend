const Contact = require("../models/contact");

exports.getContactById = (req, res, next, id) => {
       Contact.findById(id)
       .exec((err, contact) => {
              if(err)
                     return res.status(400).json({error:err})
              else if(!contact)
                     return res.status(404).json({error:"Contact not found!"})
              else {
                     req.contact = contact;
                     next();
              }
       });
}

exports.createContact = (req, res) => {
       const contact = new Contact(req.body);

       contact.save((err,contact) => {
              if(err) 
                     return res.status(400).json({error:"Not able to send message!"});
              return res.json(contact);
       })
}

exports.getContact = (req, res) => {
       return req.contact;
}

exports.getAllContacts = (req, res) => {
       Contact.find({})
       .exec((err, contacts) => {
              if(err)
                     return res.status(400).json({error:err})
              else if(!contacts)
                     return res.status(404).json({error:"No contacts found!"})
              else 
                     return res.json(contacts);
       });
}