import { Module } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { InstitutionController } from './institution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { InstitutionEntity } from './entities/institution.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([InstitutionEntity,UserEntity]),
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
  controllers: [InstitutionController],
  providers: [InstitutionService, RoleGuard ,JwtAuthGuard],
  exports: [InstitutionService]
})
export class InstitutionModule {}
