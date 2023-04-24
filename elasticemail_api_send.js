"use strict";
require("dotenv").config();

// Read Email Template from html file
const fs = require("fs");
const htmlFile = fs.readFileSync("./index.htm", { encoding: "utf-8" });

// Read Email LIST from excel file
const XLSX = require("xlsx");
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

/* Initialization */
const ElasticEmail = require('@elasticemail/elasticemail-client');

const client = ElasticEmail.ApiClient.instance;

/* Generate and use your API key */
const apikey = client.authentications['apikey'];
apikey.apiKey = process.env.ELASTICEMAIL_API_KEY;

/**
 * Send bulk emails
 * Example api call that sends bulk merge email.
 */
async function main(toEmail) {
    const emailsApi = new ElasticEmail.EmailsApi();
    const emailData = {
        Recipients: [
            {
                Email: toEmail,
            }
        ],
        Content: {
            Body: [
                {
                    ContentType: "HTML",
                    Charset: "utf-8",
                    Content: htmlFile
                },
                {
                    ContentType: "PlainText",
                    Charset: "utf-8",
                    Content: process.env.EMAIL_TEXT
                }
            ],
            From: process.env.EMAIL_FROM,
            Subject: process.env.EMAIL_SUBJECT
        }
    };

    const callback = (error, data, response) => {
        if (error) {
            console.error(error);
        } else {
            console.log('API called successfully.');
            console.log('Email sent to '+toEmail+'.');
        }
    };
    emailsApi.emailsPost(emailData, callback);
}

emailList.forEach(element => {
    main(element)
  });