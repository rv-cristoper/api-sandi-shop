import nodemailer from 'nodemailer'
import config from '../config/index.js';

class emailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    })
  }

  sendEmail(to, subject, html, attachments = []) {
    return this.transporter.sendMail({
      from: config.emailUser,
      to,
      subject,
      html,
      attachments,
    })
  }
}

export default new emailService();