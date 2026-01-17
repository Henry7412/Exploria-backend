import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendPasswordReset(email: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <p>Solicitaste restablecer tu contraseña.</p>
        <p>Haz clic aquí (válido por 15 minutos):</p>
        <p><a href="${link}">${link}</a></p>
        <p>Si no fuiste tú, ignora este correo.</p>
      `,
    });
  }
}
