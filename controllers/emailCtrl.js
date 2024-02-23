const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const sendEmail = asyncHandler(async (data, req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MP, // generated
    },
  });

  let info = await transporter.sendMaill({
    from: "XYZ@gmail.com",
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text,
    html: data.htm, // html body
  });

  console.log("Message sent: %s", info.messageld);
  console.log("Preview UrlL %s", nodemailer.getTestMessageUrl(info));
});

module.exports = sendEmail;
