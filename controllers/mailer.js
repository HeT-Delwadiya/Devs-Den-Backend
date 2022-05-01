const nodemailer = require("nodemailer");

exports.sendMail = (email, subject, text) => {
       const  transporter = nodemailer.createTransport({
              host: process.env.HOST,
              service: process.env.SERVICE,
              port: 587,
              secure: true,
              auth: {
                     user: process.env.USER,
                     pass: process.env.PASS
              }
       })
       console.log(process.env.USER);
       console.log(process.env.PASS);
       transporter.sendMail({
              from: process.env.USER,
              to: email,
              subject: subject,
              text: text
       })
}