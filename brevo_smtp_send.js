// https://nodemailer.com/about/

"use strict";
require("dotenv").config();
const nodemailer = require("nodemailer");

const fs = require("fs");
const XLSX = require("xlsx");

// async..await is not allowed in global scope, must use a wrapper
async function main(toEmail, htmlBody, indexN) {
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

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: process.env.EMAIL_FROM, // sender address
		to: toEmail, // list of receivers
		subject: process.env.EMAIL_SUBJECT, // Subject line
		text: process.env.EMAIL_TEXT, // plain text body
		// html: htmlBody, // html body
	});

	console.log("Message sent: %s", info.messageId);
	console.log(info.envelope, " => ", indexN)
}

// const htmlFile = fs.readFileSync("./index.htm", { encoding: "utf-8" });
const htmlFile = null

// let workbook = XLSX.readFile("./emails.xlsx");
let workbook = XLSX.readFile("./emails_10k.xlsx");
let sheet_name_list = workbook.SheetNames;
let xlData = workbook.Sheets[sheet_name_list[0]];
let xlKeys = Object.keys(xlData);

for (let i = 1; i < xlKeys.length - 1; i++) {
	const key = xlKeys[i];
	const emailName = xlData[key].v;
	main(emailName, htmlFile, i).catch(console.error);
}