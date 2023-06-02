import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { DeviceToken } from './entities/device_tokens.entity';
import { FirebaseModule } from 'src/firebase-module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { RoleGuard } from 'src/user/guards/rôles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity,DeviceToken]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
        secret:process.env.SECRET,
        signOptions: {
          expiresIn: 3600
        }
      }),
    FirebaseModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService,RoleGuard ,JwtAuthGuard],
  exports :[NotificationService]
})
export class NotificationModule {}
