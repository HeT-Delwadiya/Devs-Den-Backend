const request = require('request');
const Compiler = require("../models/compiler");

exports.getCodeById = (req, res, next, id) => {
       Compiler.findById(id)
              .populate("user","name avatar")
              .exec((err, code) => {
              if(err)
                     return res.status(400).json({error:err})
              else if(!code)
                     return res.status(400).json({error:"Code not found!"})
              else {
                     req.code = code;
                     next();
              }
       });
}

exports.getCode = (req, res) => {
       return res.json(req.code);
}

exports.saveCode = (req, res) => {
       const compiler = new Compiler(req.body);

       compiler.save((err, code) => {
              if(err) {
                   return res.status(400).json({error:"Not able to save the code to DataBase!"+err});
              }
              return res.json(code);
       });
}

exports.updateCode = (req, res) => {
       Compiler.findByIdAndUpdate(
              {_id: req.code._id},
              {$set: req.body},
              {new: true, useFindAndModify: false},
              (err, code) => {
                     if(err)
                            return res.status(400).json({error:"You are not authorized to update the code!"});
                     res.json(code);
         })
}

exports.deleteCode = (req, res) => {
       const code = req.code;

       code.remove((err, code) => {
              if(err)
                     return res.status(400).json({error:"Failed to delete the code"});
              res.json({message:"Successfully deleted "+req.code.user.name+"'s code."});
       });
}

exports.compilerApi = (req, res) => {
       
       var options = {
              'method': 'POST',
              'url': 'https://ide.geeksforgeeks.org/main.php',
              'headers': {
                     'Accept': 'application/json',
                     'Content-Type': 'application/x-www-form-urlencoded'
              },
              form: {
                     'lang': req.body.lang,
                     'code': req.body.code,
                     'input': req.body.input,
                     'save': 'false'
              }
       };
       request(options, function (error, response) {
              if (error) throw new Error(error);
                     return res.status(200).json(response.body);
       });
}

exports.fetchResult = (req, res) => {

       var options = {
              'method': 'POST',
              'url': 'https://ide.geeksforgeeks.org/submissionResult.php',
              'headers': {
                     'Accept': 'application/json',
                     'Content-Type': 'application/x-www-form-urlencoded'
              },
              form: {
                     'requestType': 'fetchResults',
                     'sid': req.body.sid
              }
       };
       request(options, function (error, response) {
              if (error) throw new Error(error);
                     return res.status(200).json(response.body);
       });
}

