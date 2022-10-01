const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = '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';
sgMail.setApiKey(SENDGRID_API_KEY);

const msg = {
  to: 'rafael.valdespino@g-global.com', // Change to your recipient
  from: 'app@g-global.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail
  .send(msg)
  .then((response) => {
    console.log('Response', response.body);
    // console.log(response[0].statusCode);
    // console.log(response[0].headers);
  })
  .catch((error) => {
    console.error('Error', error.message);
  });
