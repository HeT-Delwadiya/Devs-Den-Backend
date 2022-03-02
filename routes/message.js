const express = require("express");
const router = express.Router();

const { getMessageById, createMessage, getMessage, getMessagesOfConversation, getMessagesOfGroup, deleteMessage } = require("../controllers/message");
const {isSignedIn} = require("../controllers/auth");

router.param("messageId", getMessageById);

//create
router.post("/message/create", isSignedIn, createMessage);

//read
router.get("/message/:messageId", isSignedIn, getMessage);
router.post("/messages/all", isSignedIn, getMessagesOfConversation);
router.post("/group/messages/all", isSignedIn, getMessagesOfGroup);

//delete
router.delete("/message/:messageId/delete", isSignedIn, deleteMessage);

module.exports = router;