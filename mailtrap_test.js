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
async function main() {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAILTRAP_AUTH_USER, // generated user
      pass: process.env.MAILTRAP_AUTH_PASS, // generated password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.FROM_EMAIL, // sender address
    to: emailList, // list of receivers
    subject: process.env.MAIL_SUBJECT, // Subject line
    text: process.env.MAIL_TEXT, // plain text body
    html: htmlFile, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

main().catch(console.error);
