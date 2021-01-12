const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmail(mailOptions) {
  return new Promise((resolve, reject) => {
    sgMail.send(mailOptions, (error, result) => {
      if (error){
        console.log('sendgrid error',error);
        return reject(error);
      } 
      console.log('in sending queue...');
      return resolve(result);
    });
  });
}

module.exports = sendEmail;