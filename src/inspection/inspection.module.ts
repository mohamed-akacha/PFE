import { Module } from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { InspectionController } from './inspection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionEntity } from './entites/inspection.entity';
import { UserModule } from 'src/user/user.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/user/strategy/passport-jwt.strategy';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { InspectionUnitModule } from 'src/inspection-unit/inspection-unit.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([InspectionEntity,UserEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
        secret:process.env.SECRET,
        signOptions: {
          expiresIn: 3600
        }
      }),
    UserModule,InspectionUnitModule,NotificationModule
  ],
  controllers: [InspectionController],
  providers: [InspectionService, JwtStrategy, RoleGuard],
  exports: [InspectionService]
})
export class InspectionModule {}
