"use strict";
require("dotenv").config();

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

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// async..await is not allowed in global scope, must use a wrapper
async function main(toEmail) {
  const msg = {
    to: toEmail, // Change to your recipient
    from: process.env.FROM_EMAIL, // Change to your verified sender
    subject: process.env.MAIL_SUBJECT,
    text: process.env.MAIL_TEXT,
    html: htmlFile,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

emailList.forEach(element => {
  main(element)
});