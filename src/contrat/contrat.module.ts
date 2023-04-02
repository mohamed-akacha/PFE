import { Module } from '@nestjs/common';
import { ContratService } from './contrat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Contrat } from './entities/contrat.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { ContratController } from './contrat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contrat,UserEntity]),
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
  controllers: [ContratController],
  providers: [ContratService, RoleGuard ,JwtAuthGuard]
})
export class ContratModule {}
