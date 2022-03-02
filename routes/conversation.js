const express = require("express");
const router = express.Router();

const { getConversationById, createConversation, getConversation, getAllConversations, getConversationByMemberId, deleteConversation } = require("../controllers/conversation");
const {isSignedIn} = require("../controllers/auth");

router.param("conversationId", getConversationById);

//create
router.post("/conversation/create", isSignedIn, createConversation);

//read
router.get("/conversation/:conversationId", isSignedIn, getConversation);
router.post("/conversations/all", isSignedIn, getAllConversations);
router.post("/conversation/find", isSignedIn, getConversationByMemberId);

//delete
router.delete("/conversation/:conversationId/delete", isSignedIn, deleteConversation);

module.exports = router;