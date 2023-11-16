// https://nodemailer.com/about/

"use strict";
require("dotenv").config();
const nodemailer = require("nodemailer");

const fs = require("fs");
const XLSX = require("xlsx");

// async..await is not allowed in global scope, must use a wrapper
async function main(toEmail, toUser, htmlBody, indexN) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_SERVER,
    port: process.env.BREVO_SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.BREVO_SMTP_USERNAME,
      pass: process.env.BREVO_SMTP_PASSWORD,
    },
  });

  // console.log("Hi " + `${toUser}` + process.env.EMAIL_TEXT);
  let bodyEmail = "Hi " + `${toUser}` + process.env.EMAIL_TEXT;
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.EMAIL_FROM, // sender address
    to: toEmail, // list of receivers
    subject: process.env.EMAIL_SUBJECT, // Subject line
    text: bodyEmail, // plain text body
    // html: htmlBody, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log(info.envelope, " => ", indexN);
}

// const htmlFile = fs.readFileSync("./index.htm", { encoding: "utf-8" });
const htmlFile = null;

let workbook = XLSX.readFile(process.env.HOLDERS);
let sheet_name_list = workbook.SheetNames;
let xlData = workbook.Sheets[sheet_name_list[0]];
let xlKeys = Object.keys(xlData);
console.log(xlKeys.length);
let countRow = 0;
for (let i = 1; i < xlKeys.length - 1; i += 2) {
  const keyA = xlKeys[i];
  const emailName = xlData[keyA].v;
  const keyB = xlKeys[i + 1];
  const firstName = xlData[keyB].v;
  countRow += 1;
  console.log(countRow);
  // console.log(emailName, firstName);
  main(emailName, firstName, htmlFile, countRow).catch(console.error);
}
