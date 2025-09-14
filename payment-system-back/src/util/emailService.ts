import nodemailer from 'nodemailer';

export const sendNotificationEmail = async (to: string, subject: string, message: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER ||'kingsworksproject@gmail.com',
      pass: process.env.EMAIL_PASS || 'fgzz eghk otfk vkpo'
    }
  });


  await transporter.sendMail({
    from: `"Payment System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `<p>${message}</p>`
  });
};