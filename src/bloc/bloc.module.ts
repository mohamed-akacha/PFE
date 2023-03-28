import { Module } from '@nestjs/common';
import { BlocService } from './bloc.service';
import { BlocController } from './bloc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlocEntity } from './entities/bloc.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { RoleGuard } from 'src/user/guards/rôles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlocEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
        secret:process.env.SECRET,
        signOptions: {
          expiresIn: 3600
        }
      })
  ],
  controllers: [BlocController],
  providers: [BlocService , RoleGuard ,JwtAuthGuard ],
  exports:[BlocService]
})
export class BlocModule {}
