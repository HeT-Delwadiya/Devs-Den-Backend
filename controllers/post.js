const Post = require("../models/post");
const User = require("../models/user");
const Company = require("../models/company");
const _ = require('lodash');

exports.getPostById = (req, res, next, id) => {
       Post.findById(id)
       .populate("user","_id type name avatar")     
       .exec((err, post) => {
              if(err)
                     return res.status(400).json({error:err})
              else if(!post)
                     return res.status(404).json({error:"Post not found!"})
              else {
                     req.post = post;
                     next();
              }
       });
}

exports.createPost = (req, res) => {

       const post = new Post(req.body);
       post.save((err, post) => {
              if(err) {
                     return res.status(400).json({error:"Not able to save the post to DataBase!"});
              }
              if(req.body.userType=="User") {
                     User.findByIdAndUpdate(
                     {_id: req.body.user},
                     {$push: {posts: post._id}},
                     {new: true},
                     (err, user) => {
                            if(err)
                                   return res.status(400).json({error:"Failed to add new post in user's database!"});
                            user.salt = undefined;
                            user.encry_password = undefined;
                            user.createdAt = undefined;
                            user.updatedAt = undefined;
                            res.json(user);
                     })
              } else {
                     Company.findByIdAndUpdate(
                     {_id: req.body.user},
                     {$push: {posts: post._id}},
                     {new: true},
                     (err, company) => {
                            if(err)
                                   return res.status(400).json({error:"Failed to add new post in user's database!"});
                            company.salt = undefined;
                            company.encry_password = undefined;
                            company.createdAt = undefined;
                            company.updatedAt = undefined;
                            res.json(company);
                     })
              }
       });
}

exports.getPost = (req, res) => {
       return res.json(req.post);
}

exports.getPosts = (req, res) => {
       Post.find({})
       .exec((err, posts) => {
              if(err)
                     return res.status(400).json({error:"Failed to fetch your feed!"});
              res.json(posts);
       })
}

exports.addLike = (req, res) => {
       Post.findByIdAndUpdate(
              {_id: req.post._id},
              {$push: {likes: req.body.userId}},
              {new: true},
              (err, post) => {
                     if(err)
                            return res.status(400).json({error:"Failed to add like to the post!"+err});
                     res.json(post);
       })
}

exports.removeLike = (req, res) => {
       let removeIndex = 0;

       req.post.likes.map((like, index) => {
              if(req.body.userId==like)
                     removeIndex=index;
       })

       req.post.likes.splice(removeIndex, 1);

       Post.findByIdAndUpdate(
              {_id: req.post._id},
              {$set: {likes: req.post.likes}},
              {new: true},
              (err, post) => {
                     if(err)
                            return res.status(400).json({error:"Failed to add like to the post!"});
                     res.json(post);
       })
}

exports.addComment = (req, res) => {
       Post.findByIdAndUpdate(
              {_id: req.post._id},
              {$push: {comments: req.body}},
              {new: true},
              (err, post) => {
                     if(err)
                            return res.status(400).json({error:"Failed to add comment to the post!"+err});
                     res.json(post);
       })
}

exports.removeComment = (req, res) => {
       let removeIndex = 0;

       req.post.comments.map((comment, index) => {
              if(req.body.commentId==comment.commentId)
                     removeIndex=index;
       })

       req.post.comments.splice(removeIndex, 1);

       Post.findByIdAndUpdate(
              {_id: req.post._id},
              {$set: {comments: req.post.comments}},
              {new: true},
              (err, post) => {
                     if(err)
                            return res.status(400).json({error:"Failed to add like to the post!"});
                     res.json(post);
       })
}

exports.deletePost = (req, res) => {
       const post = req.post;
       let postId = req.post._id;
       let userType = req.post.userType;
       let userId = _.trim(req.post.user._id, 'new ObjectId(")');
       let removeIndex = 0;

       post.remove((err, post) => {
              if(err)
                     return res.status(400).json({error:"Failed to delete the post"});
       });

       if (userType=="User") {
              User.findById(userId).exec((err, user) => {
                     if(err)
                            return res.status(400).json({error:err})
                     else if(!user)
                            return res.status(400).json({error:"User not found!"})
                     else {
                            user.posts.map((post, index) => {
                                   if (post == _.toString(postId)) {
                                          removeIndex = index;
                                   }
                            })
                            user.posts.splice(removeIndex, 1);

                            User.findByIdAndUpdate(
                                   {_id: userId},
                                   {$set: {posts: user.posts}},
                                   {new: true},
                                   (err, nuser) => {
                                          if(err)
                                                 return res.status(400).json({error:"Failed to remove post from user's database!"});
                                          nuser.salt = undefined;
                                          nuser.encry_password = undefined;
                                          nuser.createdAt = undefined;
                                          nuser.updatedAt = undefined;
                                          res.json(nuser);
                            })
                     }
              });

       } else {
              Company.findById(userId).exec((err, company) => {
                     if(err)
                            return res.status(400).json({error:err})
                     else if(!company)
                            return res.status(400).json({error:"Company not found!"})
                     else {
                            company.posts.map((sPost, index) => {
                                   if(sPost == _.toString(postId)) {
                                          removeIndex = index
                                   }
                            })
                            company.posts.splice(removeIndex, 1);

                            Company.findByIdAndUpdate(
                                   {_id: userId},
                                   {$set: {posts: company.posts}},
                                   {new: true},
                                   (err, ncompany) => {
                                          if(err)
                                                 return res.status(400).json({error:"Failed to remove post from user's database!"});
                                          ncompany.salt = undefined;
                                          ncompany.encry_password = undefined;
                                          ncompany.createdAt = undefined;
                                          ncompany.updatedAt = undefined;
                                          res.json(ncompany);
                            })
                     }
              });
       }
}