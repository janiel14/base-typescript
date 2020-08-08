import { createTransport } from 'nodemailer'
import { NodeMailerResponse, NodeMailerAttachment } from './types/utils/NodeMailerResponse'
import Mail = require('nodemailer/lib/mailer')
import { Logger } from './Logger'

export class MailSender {
  private transporter: Mail
  private from = 'System <never-replay@meugasja.com>'

  constructor() {
    this.transporter = createTransport({
      host: process.env.NODE_MAIL_HOST,
      port: parseInt(process.env.NODE_MAIL_PORT, 10),
      secure: false,
      auth: {
        user: process.env.NODE_MAIL_USER,
        pass: process.env.NODE_MAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    })
  }

  public async testConnectingMailServer() {
    try {
      await this.transporter.verify()
    } catch (error) {
      Logger.error('TEST_MAIL_SERVER_ERROR', `Mainsender.testConnectingMailServer: `, error)
    }
  }

  public async sendText(to: string, subject: string, message: string, attachments: NodeMailerAttachment[]): Promise<NodeMailerResponse> {
    try {
      return await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        text: message,
        html: null,
        attachments: attachments
      })
    } catch (error) {
      Logger.error('SEND_TEXT_ERROR', `Mainsender.sendText: `, error)
      throw error
    }
  }

  public async sendHtml(to: string, subject: string, message: string, attachments: NodeMailerAttachment[]): Promise<NodeMailerResponse> {
    try {
      return await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        text: null,
        html: message,
        attachments: attachments
      })
    } catch (error) {
      Logger.error('SEND_HTML_ERROR', `Mainsender.sendHtml: `, error)
      throw error
    }
  }
}
