require('dotenv').config(); 
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS  
    }
});

async function sendVerificationEmail(toEmail, verificationCode) {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: toEmail,
        subject: 'Email Verification',
        html: `
            <h3>Verify your email</h3>
            <p>Your verification code is:</p>
            <h2>${verificationCode}</h2>
            <p>Please enter this code to verify your account.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${toEmail}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Could not send verification email');
    }
}

module.exports = {
    sendVerificationEmail
};
