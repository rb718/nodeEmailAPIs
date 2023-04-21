"use strict";
require("dotenv").config();

const formData = require("form-data");
const Mailgun = require("mailgun.js");

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

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  const DOMAIN = process.env.DOMAIN_ADDRESS;
  // create reusable mailgun client
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_PRIVATE_API_KEY,
  });

  // send mail with defined mailgun client object
  await mg.messages
    .create(DOMAIN, {
      from: process.env.FROM_EMAIL,
      to: emailList,
      subject: process.env.MAIL_SUBJECT,
      text: process.env.MAIL_TEXT,
      html: htmlFile,
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.log(err)); // logs any error`;
}

main();
