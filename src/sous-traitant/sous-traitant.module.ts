import { Module } from '@nestjs/common';
import { SousTraitantService } from './sous-traitant.service';
import { SousTraitantController } from './sous-traitant.controller';
import { SousTraitantEntity } from './entities/sous-traitant.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([SousTraitantEntity,UserEntity]),
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
  controllers: [SousTraitantController],
  providers: [SousTraitantService, RoleGuard ,JwtAuthGuard ]
})
export class SousTraitantModule {}
