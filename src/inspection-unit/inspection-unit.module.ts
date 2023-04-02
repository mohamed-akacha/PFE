import { Module } from '@nestjs/common';
import { InspectionUnitService } from './inspection-unit.service';
import { InspectionUnitController } from './inspection-unit.controller';
import { InspectionUnitEntity } from './entities/inspection-unit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { UserModule } from 'src/user/user.module';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InspectionUnitEntity,UserEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
        secret:process.env.SECRET,
        signOptions: {
          expiresIn: 3600
        }
      }),
      UserModule
  ],
  providers: [InspectionUnitService, RoleGuard ,JwtAuthGuard],
  controllers: [InspectionUnitController],
  exports: [InspectionUnitService]
})
export class InspectionUnitModule {}
