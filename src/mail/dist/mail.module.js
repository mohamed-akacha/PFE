"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MailModule = void 0;
var common_1 = require("@nestjs/common");
var mailer_1 = require("@nestjs-modules/mailer");
var handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
var mail_service_1 = require("./mail.service");
var MailModule = /** @class */ (function () {
    function MailModule() {
    }
    MailModule = __decorate([
        common_1.Module({
            imports: [
                mailer_1.MailerModule.forRoot({
                    transport: {
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: 'contact.pfesante@gmail.com',
                            pass: 'ucjezfgzwprnmjdm'
                        }
                    },
                    defaults: {
                        from: 'contact.pfesante@gmail.com'
                    },
                    template: {
                        dir: __dirname + '/templates',
                        adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                        options: {
                            strict: true
                        }
                    }
                }),
            ],
            providers: [mail_service_1.MailService],
            exports: [mail_service_1.MailService]
        })
    ], MailModule);
    return MailModule;
}());
exports.MailModule = MailModule;
