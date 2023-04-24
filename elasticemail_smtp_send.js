// https://nodemailer.com/about/

"use strict";
require("dotenv").config();
const nodemailer = require("nodemailer");

const fs = require("fs");
const XLSX = require("xlsx");

const htmlFile = fs.readFileSync("./index.htm", { encoding: "utf-8" });

let workbook = XLSX.readFile("./emails.xlsx");
let sheet_name_list = workbook.SheetNames;
let emailList = [];
let xlData = workbook.Sheets[sheet_name_list[0]];
let xlKeys = Object.keys(xlData);

for (let i = 1; i < xlKeys.length - 1; i++) {
  const key = xlKeys[i];
  const emailName = xlData[key].v;
  emailList.push(emailName);
}
// const emailTo = emailList.join(", "); // array to string

// async..await is not allowed in global scope, must use a wrapper
async function main(toEmail) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.ELASTICEMAIL_SMTP_HOST,
    port: process.env.ELASTICEMAIL_SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.ELASTICEMAIL_SMTP_USERNAME,
      pass: process.env.ELASTICEMAIL_SMTP_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.EMAIL_FROM, // sender address
    to: toEmail, // list of receivers
    subject: process.env.EMAIL_SUBJECT, // Subject line
    text: process.env.EMAIL_TEXT, // plain text body
    html: htmlFile, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log(info.envelope)
}

emailList.forEach(element => {
    main(element).catch(console.error);
});