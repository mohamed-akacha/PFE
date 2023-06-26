import {
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LoginCredentialsDto } from "./dto/login-credentials.dto";
import { UserEntity } from "./entities/user.entity";
import * as bcrypt from 'bcrypt';
import { isAdmin } from "./shared.utils";
import { MailService } from "src/mail/mail.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import {RefreshTokenService} from"./refresh-token.service";
import { UserService } from "./user.service";
import { UserRSubscribeDto } from "./dto/real-user-create.dto";
import { randomInt } from "crypto";
import { NotificationService } from "src/notification/notification.service";
import { ConfigService } from '@nestjs/config';
import {Tokens} from "./types/tokens.type";

@Injectable()
export class AuthService {
    //constructor
    constructor(@InjectRepository(UserEntity)
                private userRepository: Repository<UserEntity>,
                private jwtService: JwtService,
                private config: ConfigService,
                private readonly mailService: MailService,
                private readonly userService: UserService,
                private readonly notificationService: NotificationService,) { }
    //authentification
    async login(credentials: LoginCredentialsDto) {
        // Récupére le login, le mot de passe, et le token de device
        const { email, password, deviceToken } = credentials;
        const user = await this.userRepository
            .createQueryBuilder("user")
            .where("user.email = :email", { email })
            .getOne();
        if (!user) { throw new NotFoundException('Compte inexistant.');}
        const hashedPassword = await bcrypt.hash(password, user.salt);
        if (hashedPassword === user.password) {
            const tokens = await this.getTokens(user.id,user.email,user.username,user.role);
            await this.updateRtHash(user, tokens.refresh_token);
            // Ajoute le token de device à la base de données
            if (deviceToken) {
                await this.notificationService.addDeviceToken(user.id, deviceToken);
            }

            return tokens;
        } else {
            throw new NotFoundException('Mot de passe incorrect.');
        }
    }

    async createUser(userReq: UserEntity, userData: UserRSubscribeDto) : Promise<any> {
        if (!isAdmin(userReq)) {
            throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
        }
        const user = this.userRepository.create({
            ...userData
        });
        try {
            const savedUser = await this.userRepository.save(user);
            const saltRounds = 10;
            const userId = savedUser.id.toString();
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(userId, salt);
            const hashedId = hash.slice(7);
            const hash_userId = `${hashedId}_${userId}`;
            const encodedHash_userId = encodeURIComponent(hash_userId);
            const newUrl = `http://localhost:3000/auth/confirm/${encodedHash_userId}`;
            // Send email to the savedUser's email (via gmail.com)
            await this.mailService.sendConfirmationEmail(
                savedUser.email,
                "New user",
                newUrl,
            );
            return savedUser;
        }
        catch (e) {
            console.log(e.message);
            if (e.errno === 1062) {
                throw new ConflictException('Le username et le email doivent être unique');
            }
            throw new InternalServerErrorException();
        }
    }

    async confirmAccount(id: number, updateUserDto: UpdateUserDto): Promise<Partial<UserEntity>> {
        const user = await this.userService.getUserById(id);
        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé.');
        }
        if (user.username) {
            throw new NotFoundException('Compte déjà confirmé.');
        }
        user.username = updateUserDto.username;
        user.role = user.role;
        user.email = user.email;
        user.tel = updateUserDto.tel;
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(updateUserDto.password, user.salt);
        try {
            return await this.userRepository.save(user);
        }
        catch (e) {
            if (e.errno === 1062) {
                throw new ConflictException('Le username et le email doivent être unique');
            }
            throw new InternalServerErrorException();
        }
    }

    async sendVerificationCode(email: string): Promise<{ success: boolean, message?: string }> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .getOne();

        if (!user) {
            throw new UnauthorizedException('Aucun utilisateur n\'a été trouvé avec cette adresse e-mail.');
        }

        const verificationCode = randomInt(10000, 99999).toString();
        user.verifyCode = verificationCode;
        await this.userRepository.save(user);

        return await this.mailService.sendConfirmationCodeEmail(email, verificationCode);

        //return 'Le code de vérification a été envoyé par e-mail.';
    }

    async verifyEmailCode(email: string, verifycode: string): Promise<{ success: boolean, message?: string }> {
        const user = await this.userRepository
            .createQueryBuilder('users') 
            .where('users.email = :email', { email }) 
            .andWhere('users.verifyCode = :code', { code: verifycode }) 
            .getOne();

        if (!user) {
            return { success: false, message: 'User not found' };
        }
        return { success: true, message: "Email confirmation successful" };
    }

    async changePassword(email: string, newPassword: string): Promise<{ success: boolean, message?: string }> {
        const user = await this.userRepository.createQueryBuilder('user')
            .addSelect('user.password')
            .addSelect('user.salt')
            .where('user.email = :email', { email })
            .getOne();

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        const newSalt = await bcrypt.genSalt();
        const newPasswordHash = await bcrypt.hash(newPassword, newSalt);

        user.salt = newSalt;
        user.password = newPasswordHash;

        try {
            await this.userRepository.save(user);
            return { success: true, message: 'password changed' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to change password' };
        }
    }






    async logout(userId: number): Promise<boolean> {
        await this.userRepository.createQueryBuilder("user").update()
            .set({"hashedRt": null})
            .where("id = :id ", {id:userId})
            .andWhere('hashedRt not(:hr)', { hr:null })
            .execute();
        return true;
    }

    async refreshTokens(userReq: UserEntity, rt: string): Promise<Tokens> {
        const userId=userReq.id;
        const user=await this.userRepository.createQueryBuilder("user")
            .where("id = :id", { userId })
            .getOne();
        if (!user || !user.hashedRt) throw new ForbiddenException('Accès refusé');
        const rtMatches = await bcrypt.verify(user.hashedRt, rt);
        if (!rtMatches) throw new ForbiddenException('Accès refus');
        const tokens = await this.getTokens(userId,userReq.email,userReq.username,userReq.role);
        await this.updateRtHash(user, tokens.refresh_token);
        return tokens;
    }

    async updateRtHash(user:UserEntity, rt: string): Promise<void> {
        try {
            const hash = await bcrypt.hash(rt, user.salt);
            const userId = user.id;
            await this.userRepository.createQueryBuilder("user").update()
                .set({"hashedRt": hash})
                .where("id = :id", {id:userId})
                .execute();
        }catch(error){
            console.log(error)
        }
    }

    async getTokens(userId: number, email: string,username:string,role:string): Promise<Tokens> {

        try{
            const jwtPayload = {
                sub: userId,
                id: userId,//user.id,
                username: username,//user.username,
                email: email, //user.email,
                role: role,// user.role,
            };

            const [at, rt] = await Promise.all([
                this.jwtService.signAsync(jwtPayload, {
                    secret: this.config.get<string>('AT_SECRET'),
                    expiresIn: '1d',
                }),
                this.jwtService.signAsync(jwtPayload, {
                    secret: this.config.get<string>('RT_SECRET'),
                    expiresIn: '7d',
                }),
            ]);
            return {
                access_token: at,
                refresh_token: rt,
            };
        }catch(error){
            console.log(error)
        }
    }


}