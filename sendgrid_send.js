"use strict";
require("dotenv").config();
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "ex@email.com", // Change to your recipient
  from: process.env.FROM_EMAIL, // Change to your verified sender
  subject: process.env.MAIL_SUBJECT,
  text: process.env.MAIL_TEXT,
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};
sgMail
  .send(msg)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error);
  });
