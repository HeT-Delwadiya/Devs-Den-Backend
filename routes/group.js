const express = require("express");
const router = express.Router();

const { getGroupById, createGroup, getGroup, updateGroup, addMemberToGroup, deleteGroup, removeMemberFromGroup } = require("../controllers/group");
const {isSignedIn} = require("../controllers/auth");

router.param("groupId", getGroupById);

//create
router.post("/group/create", isSignedIn, createGroup);

//read
router.get("/group/:groupId", isSignedIn, getGroup);

//update
router.put("/group/:groupId/update", isSignedIn, updateGroup);
router.post("/group/:groupId/member/add", isSignedIn, addMemberToGroup);

//delete
router.post("/group/:groupId/delete", isSignedIn, deleteGroup);
router.post("/group/:groupId/member/remove", isSignedIn, removeMemberFromGroup);

module.exports = router;