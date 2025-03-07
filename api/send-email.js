import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, message } = req.body;

    // Setup transporter using Gmail SMTP
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bluedcrasher@gmail.com', 
            pass: 'ciyw beif aiwj znry' 
        }
    });

    const mailOptions = {
        from: email,
        to: 'bluedcrasher@gmail.com',
        subject: `Crasher Studios Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Email sent!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error sending email.' });
    }
}
