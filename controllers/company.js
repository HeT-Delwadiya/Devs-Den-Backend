const Company = require("../models/company");
const Post = require("../models/post");

exports.getCompanyById = (req, res, next, id) => {
       Company.findById(id)
              .populate("followers","_id name avatar")
              .populate("posts","_id description imageUrl comments likes")
              .exec((err, company) => {
              if(err)
                     return res.status(400).json({error:err})
              else if(!company)
                     return res.status(400).json({error:"Company not found!"})
              else {
                     req.profile = company;
                     next();
              }
       });
}

exports.getCompany = (req,res) => {
       req.profile.salt = undefined;
       req.profile.encry_password = undefined;
       req.profile.createdAt = undefined;
       req.profile.updatedAt = undefined;
       return res.json(req.profile);
}

exports.getAllCompanies = (req, res) => {
       Company.find({})
       .select("name field avatar followers")
       .exec((err, companies) => {
              if(err)
                     return res.status(400).json({error:"No companies found"});
              return res.json(companies);
       });
}

exports.getCompanyBySpeciality = (req, res) => {
       Company.find({specialities: { $elemMatch: {'$regex': req.body.speciality, $options:'i'} }})
       .select("name avatar size followers")
       .exec((err, companies) => {
              if(err)
                     return res.status(400).json({error:"No company found with this speciality"});
              return res.json(companies);
       });
}

exports.getCompanyByName = (req, res) => {
       Company.find({name: {'$regex': req.body.name, $options:'i'} })
       .select("name avatar size followers")
       .exec((err, companies) => {
              if(err)
                     return res.status(400).json({error:"No company found with this name"});
              return res.json(companies);
       });
}

exports.getCompanyFollowers = (req, res) => {
       return res.json(req.profile.followers)
}

exports.updateCompany = (req, res) => {
       Company.findByIdAndUpdate(
              {_id: req.profile._id},
              {$set: req.body},
              {new: true, useFindAndModify: false},
              (err, company) => {
                   if(err)
                        return res.status(400).json({error:"You are not authorized to update the info!"});
                     company.salt = undefined;
                     company.encry_password = undefined;
                     company.createdAt = undefined;
                     company.updatedAt = undefined;
                     res.json(company);
         })
}

exports.deleteCompany = (req, res) => {
       const company = req.profile;
       var error;

       company.posts.map((post) => {
              Post.findById(post._id)
                     .exec((err, p) => {
                            if(err)
                                   error = {error:"Failed to delete the post!"};
                            p.remove((err, pst) => {
                                   if(err)
                                          error =  {error:"Failed to remove the post!"}
                            })
                     })
       })

       company.remove((err, company) => {
              if(err)
                     return res.status(400).json({error:"Failed to delete the account. "+error});
              res.json({message:"Successfully deleted "+company.name+"'s account."});
       });
}