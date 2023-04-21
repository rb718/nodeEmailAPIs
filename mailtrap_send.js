"use strict";
require("dotenv").config();
const { MailtrapClient } = require("mailtrap");

// For this example to work, you need to set up a sending domain,
// and obtain a token that is authorized to send from the domain
const TOKEN = process.env.MAILTRAP_API_TOKEN;
const ENDPOINT = process.env.MAILTRAP_API_ENDPOINT;

const SENDER_EMAIL = process.env.FROM_EMAIL;
const RECIPIENT_EMAIL = "recipient@email.com";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  name: "Sender Name",
  email: process.env.MAILTRAP_SENDER_EMAIL,
};

const recipients = [
  {
    email: "topman068001@gmail.com",
  },
];

client
  .send({
    from: sender,
    to: [{ email: RECIPIENT_EMAIL }],
    subject: process.env.MAIL_SUBJECT,
    text: process.env.MAIL_TEXT,
  })
  .then(console.log, console.error);

// --demo--
// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);
