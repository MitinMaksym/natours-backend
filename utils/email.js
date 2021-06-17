const nodemailer = require('nodemailer')

const sendMail = async (options) => {
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: '6fb1e5c17baf9d',
        pass: 'ee1aff7fd30551',
      },
    });
    const mailOptions = {
        from: "Maks Mitin <mitinmaksym@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transport.sendMail(mailOptions)
}

module.exports = sendMail