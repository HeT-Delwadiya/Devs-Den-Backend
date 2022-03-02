const express = require("express");
const router = express.Router();

const { getPostById, createPost, getPost, addLike, removeLike, deletePost, getPosts, addComment, removeComment } = require("../controllers/post");
const { getUserById } = require("../controllers/user");
const {isSignedIn} = require("../controllers/auth");

router.param("userId", getUserById);
router.param("postId", getPostById);

//create
router.post("/user/post/create", isSignedIn, createPost);

//read
router.get("/post/:postId", getPost);
router.get("/posts", getPosts);

//update
router.post("/post/:postId/like", isSignedIn, addLike);
router.post("/post/:postId/dislike", isSignedIn, removeLike);
router.post("/post/:postId/comment/add", isSignedIn, addComment);
router.post("/post/:postId/comment/remove", isSignedIn, removeComment);

//delete
router.delete("/post/:postId/delete", isSignedIn, deletePost);

module.exports = router;