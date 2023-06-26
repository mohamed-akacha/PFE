import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {UserEntity} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class RefreshTokenService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) {}

    async generateRefreshToken(user: any): Promise<string> {
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
        return refreshToken;
    }


    async validateRefreshToken(userId: number, refreshToken: string): Promise<UserEntity | null> {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            return null;
        }

        const isValid = await this.jwtService.verifyAsync(refreshToken);
        return isValid ? user : null;
    }

    async verifyRefreshToken(user: UserEntity, refreshToken: string): Promise<boolean> {
        const hashedPayload = await bcrypt.hash(JSON.stringify(user), 10);
        return bcrypt.compare(refreshToken, hashedPayload);
    }
}
