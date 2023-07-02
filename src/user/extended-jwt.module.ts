import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { RefreshTokenService } from './refresh-token.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";

@Global()
@Module({})
export class ExtendedJwtModule {
    static register(options: JwtModuleOptions): DynamicModule {
        const jwtModule = JwtModule.register(options);

        return {
            module: ExtendedJwtModule,
            imports: [
                jwtModule,
                TypeOrmModule.forFeature([UserEntity]), // Register UserEntity repository
            ],
            providers: [RefreshTokenService],
            exports: [jwtModule, RefreshTokenService],
        };
    }
}
