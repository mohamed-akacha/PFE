import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionModule } from 'src/inspection/inspection.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { JwtStrategy } from 'src/user/strategy/passport-jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { EvaluationPointEntity } from './entities/evaluation-point.entity';
import { EvaluationPointController } from './evaluation-point.controller';
import { EvaluationPointService } from './evaluation-point.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([EvaluationPointEntity,UserEntity]),

    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
        secret:process.env.SECRET,
        signOptions: {
          expiresIn: 3600
        }
      }),
    UserModule,InspectionModule

  ],
  controllers: [EvaluationPointController],
  providers: [EvaluationPointService, JwtStrategy, RoleGuard],
  exports: [EvaluationPointService]
})
export class EvaluationPointModule {}
