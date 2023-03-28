import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlocModule } from 'src/bloc/bloc.module';
import { EvaluationPointModule } from 'src/evaluation-point/evaluation-point.module';
import { EvaluationPointService } from 'src/evaluation-point/evaluation-point.service';
import { InspectionModule } from 'src/inspection/inspection.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { JwtStrategy } from 'src/user/strategy/passport-jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { EvaluationEntity } from './entities/evaluation.entity';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([EvaluationEntity,UserEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
        secret:process.env.SECRET,
        signOptions: {
          expiresIn: 3600
        }
      }),
    UserModule, InspectionModule ,BlocModule ,EvaluationPointModule
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService, JwtStrategy, RoleGuard],
  exports:[EvaluationService]
})
export class EvaluationModule {}
