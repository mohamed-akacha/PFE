import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './strategy/passport-jwt.strategy';
import { UserEntity } from './entities/user.entity';
import { RoleGuard } from './guards/rôles.guard';
import { MailModule } from 'src/mail/mail.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NotificationModule } from 'src/notification/notification.module';
import {ExtendedJwtModule} from "./extended-jwt.module";


dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
      secret:process.env.SECRET,
      signOptions: {
        expiresIn: 3600
      }
    }),
    MailModule,
    NotificationModule
  ],
  controllers: [
    UserController,AuthController
  ],
  providers: [UserService, JwtStrategy,RoleGuard,AuthService],
  exports: [UserService,AuthService]
})
export class UserModule {}
