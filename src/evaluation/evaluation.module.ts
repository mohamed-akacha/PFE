import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlocModule } from 'src/bloc/bloc.module';
import { EvaluationPointModule } from 'src/evaluation-point/evaluation-point.module';
import { EvaluationPointService } from 'src/evaluation-point/evaluation-point.service';
import { InspectionModule } from 'src/inspection/inspection.module';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { JwtStrategy } from 'src/user/strategy/passport-jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { EvaluationEntity } from './entities/evaluation.entity';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([EvaluationEntity,]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
        secret:process.env.SECRET,
        signOptions: {
          expiresIn: 3600
        }
      }),
    UserModule, InspectionModule ,BlocModule ,EvaluationPointService
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService, JwtStrategy, RoleGuard]
})
export class EvaluationModule {}
