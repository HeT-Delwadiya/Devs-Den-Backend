const User = require("../models/user");
const Company = require("../models/company");
const { validationResult, Result } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req,res) => {

       const errors = validationResult(req);

       if(!errors.isEmpty()) {
              return res.json({error: errors.array()[0].msg});
       }
       if (req.body.type) {
              const newCompany = new Company(req.body);
              newCompany.save((err, user) => {
                     if(err)
                            return res.json({"Message":err});
                     else {
                            const authtoken = jwt.sign({ _id: user._id }, process.env.SECRET);
                            res.cookie("token", authtoken, { expiresIn: 60 * 60 * 9999});
                            
                            const {_id, name, email, role, type, avatar} = user;
                            return res.json({authtoken,user: {_id, name, email, role, type, avatar}});
                     }
                     
              });
       } else {
              const newUser = new User(req.body);
              newUser.save((err, user) => {
                     if(err)
                            return res.json({"Message":err});
                     else {
                            const authtoken = jwt.sign({ _id: user._id }, process.env.SECRET);
                            res.cookie("token", authtoken, { expiresIn: 60 * 60 * 9999});
                            
                            const {_id, name, email, role, type, avatar} = user;
                            return res.json({authtoken,user: {_id, name, email, role, type, avatar}});
                     }
              });
       }
}

exports.signin = (req,res) => {

       const errors = validationResult(req);
       const {type, email, password} = req.body;

       if(!errors.isEmpty()) {
              return res.json({error: errors.array()[0].msg});
       }

       if(type) {
              Company.findOne({email}, (err, user) => {
                     if(err)
                            return res.status(422).json({"Error":err});
                     else if(!user) 
                            return res.status(422).json({"Message":"Company with this email not found!"});
                     else {
                            if(!user.authenticate(password)) {
                                   return res.status(422).json({"Message":"Email and password does not match!"})
                            }
                            const authtoken = jwt.sign({ _id: user._id }, process.env.SECRET);
                            res.cookie("token", authtoken, { expiresIn: 60 * 60 * 9999});
              
                            const {_id, name, email, role, type, avatar} = user;
                            return res.json({authtoken,user: {_id, name, email, role, type, avatar}});
                     }
              }) 
       } else {
              User.findOne({email}, (err, user) => {
                     if(err)
                            return res.status(422).json({"Error":err});
                     else if(!user) 
                            return res.status(422).json({"Message":"User with this email not found!"});
                     else {
                            if(!user.authenticate(password)) {
                                   return res.status(422).json({"Message":"Email and password does not match!"})
                            }
                            const authtoken = jwt.sign({ _id: user._id }, process.env.SECRET);
                            res.cookie("token", authtoken, { expiresIn: 60 * 60 * 9999});

                            const {_id, name, email, role, type, avatar} = user;
                            return res.json({authtoken,user: {_id, name, email, role, type, avatar}});
                     }
              })
       }
};

exports.signout = (req, res) => {
       res.clearCookie("token");
       res.json({
              message: "User signed out successfully"
       });
};
   
//protected routes
exports.isSignedIn = expressJwt({
       secret: process.env.SECRET,
       algorithms: ['sha1', 'RS256', 'HS256'],
       userProperty: "auth"
});
   
//custom middlewares
exports.isAuthenticated = (req, res, next) => {
       let checker = req.profile && req.auth && req.profile._id == req.auth._id;
       if (!checker) {
              return res.status(403).json({
              error: "ACCESS DENIED"
              });
       }
       next();
};
   
exports.isAdmin = (req, res, next) => {
       if(req.profile.role === 33) {
              next();
       } else {
              return res.status(403).json({
                     error: "You are not ADMIN, Access denied!"
              });
       }
};