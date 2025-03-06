import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0

async function sendSimpleMessage() {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.API_KEY || "48984a7c4b6afd708fb901ccd54ca781-e298dd8e-adc56a0b",
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net/v3"
  });
  try {
    const data = await mg.messages.create("sandboxc9fef144a93744bf9b85bfb4cc925adc.mailgun.org", {
      from: "Mailgun Sandbox <postmaster@sandboxc9fef144a93744bf9b85bfb4cc925adc.mailgun.org>",
      to: ["Laurence Kharl Devera <laurencedevera8@gmail.com>"],
      subject: "Hello Laurence Kharl Devera",
      text: "Congratulations Laurence Kharl Devera, you just sent an email with Mailgun! You are truly awesome!",
    });

    console.log(data); // logs response data
  } catch (error) {
    console.log(error); //logs any error
  }
}

sendSimpleMessage();