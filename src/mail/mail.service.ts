import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';
import * as fs from 'fs';


@Injectable()
export class MailService {
  
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationEmail(to: string, name: string, url: string): Promise<{ success: boolean, message?: string }> {
    try {
        
        const templatePath = path.join(process.cwd(), '.', 'templates', 'confirmation.hbs');
        const emailBody = fs.readFileSync(templatePath, 'utf-8');
        const oldUrl="https://blogdesire.com/xxx-xxx-xxxx" 
        let updatedBody=await emailBody.split(oldUrl).join(url);        
        const image = path.join(process.cwd(), 'public', 'images', 'arabie-saoudite-ministere.jpg');
        const attachment = {
            filename: 'arabie-saoudite-ministere.jpg',
            path:image,
            cid: 'monid'
        };      
        await this.mailerService.sendMail({
            to: to,
            subject: 'Account confirmation',
            html: updatedBody,
            attachments: [attachment],
            context: {
            name: name
            },
        });
        return { success: true };
                
    }
    catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to send confirmation email' };
    }
    
  }

  async sendConfirmationCodeEmail(to: string, code: string): Promise<{ success: boolean, message?: string }> {
   //console.log(to,code);
    try {
      await this.mailerService.sendMail({
        
        to: to,
        subject: 'Confirmation Code',
        text: `Your confirmation code is ${code}`,
      });
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to send confirmation code email' };
    }
  }


}

