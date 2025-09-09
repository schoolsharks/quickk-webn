import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export class EmailService {
  private static instance: EmailService;
  private sesClient: SESClient;

  private constructor() {
    const config: any = {
      region: process.env.AWS_REGION!.trim(),
    };

    if (process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY) {
      config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY.trim(),
        secretAccessKey: process.env.AWS_SECRET_KEY.trim(),
      };
    }

    this.sesClient = new SESClient(config);
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const command = new SendEmailCommand({
        Source: `Webn <${process.env.EMAIL_FROM!}>`,
        Destination: {
          ToAddresses: Array.isArray(options.to) ? options.to : [options.to],
        },
        Message: {
          Subject: {
            Data: options.subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: options.html,
              Charset: 'UTF-8',
            },
          },
        },
      });

      const response = await this.sesClient.send(command);

      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
