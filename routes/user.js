const express = require("express");
const router = express.Router();

const {getUserById, getUser, getAllUsers, getUsersBySkill, getUsersByName, verifyUser, getFollowers, getFollowings, getUserByEmail, updateUser, followUser, deleteUser, unfollowUser} = require("../controllers/user");
const {isSignedIn, isAuthenticated} = require("../controllers/auth");

router.param("userId", getUserById);

//read
router.get("/user/:userId", isSignedIn, getUser);
router.get("/users/all", isSignedIn, getAllUsers);
router.get("/user/:userId/followers", isSignedIn, getFollowers);
router.get("/user/:userId/followings", isSignedIn, getFollowings);

router.post("/user/email/check", getUserByEmail);
router.post("/user/search/skill", getUsersBySkill);
router.post("/user/search/name", getUsersByName);

router.get("/user/verify/:userId/:token", verifyUser);

//update
router.put("/user/:userId/update", isSignedIn, isAuthenticated, updateUser);
router.post("/user/follow", isSignedIn, followUser);
router.post("/user/unfollow", isSignedIn, unfollowUser);

//delete
router.delete("/user/:userId/delete", isSignedIn, isAuthenticated, deleteUser);


module.exports = router;