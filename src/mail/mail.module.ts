import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
              host: 'smtp.gmail.com',
              port: 587,
              secure: false,
              auth: {
                user: 'contact.pfesante@gmail.com',
                pass: 'ucjezfgzwprnmjdm',
              },
            },
            defaults: {
              from: 'contact.pfesante@gmail.com',
            },
            // template: {
            //   dir: __dirname + '/templates',
            //   adapter: new HandlebarsAdapter(),
            //   options: {
            //     strict: true,
            //   },
            // },
          }),
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}
