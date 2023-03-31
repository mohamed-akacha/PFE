import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionalEmailsApi,ApiClient,SibApiV3Sdk, SendEmail } from 'sib-api-v3-sdk';

@Injectable()
export class SendinblueService {
  private sendinblue: TransactionalEmailsApi;
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDINBLUE_API_KEY');
    const defaultClient = ApiClient.instance;
    const auth = defaultClient.authentications['api-key'];
    auth.apiKey = apiKey;
    this.sendinblue = new TransactionalEmailsApi();
  }

  async sendEmail(
    receiverEmail: string,
    receiverName: string,
    headerName: string,
    content: string
  ): Promise<SibApiV3Sdk.SendSmtpEmail> {
    const sendEmail: SendEmail = {
      to: [{ email: receiverEmail, name: receiverName }],
      htmlContent: content,
      headers: { 'Content-Type': 'text/html; charset=UTF-8' },
      subject: `${headerName}`,
      sender: { email: "benakachamohamed11@gmail.com" },
    };
    return this.sendinblue.sendTransacEmail(sendEmail).then(console.log)
  }
}
