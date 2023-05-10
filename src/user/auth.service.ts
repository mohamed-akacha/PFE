import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LoginCredentialsDto } from "./dto/login-credentials.dto";
import { UserEntity } from "./entities/user.entity";
import * as bcrypt from 'bcrypt';
import { isAdmin } from "./shared.utils";
import { MailService } from "src/mail/mail.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";
import { UserRSubscribeDto } from "./dto/real-user-create.dto";
import { randomInt } from "crypto";
@Injectable()
export class AuthService {
    //constructor
    constructor(@InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
        private jwtService: JwtService,
        private readonly mailService: MailService,
        private readonly userService: UserService) { }
    //authentification
    async login(credentials: LoginCredentialsDto) {
        // Récupére le login et le mot de passe
        const { email, password } = credentials;
        const user = await this.userRepository
            .createQueryBuilder("user")
            .where("user.email = :email", { email })
            .getOne();
        if (!user)
            throw new NotFoundException('Compte inexistant.');
        const hashedPassword = await bcrypt.hash(password, user.salt);
        if (hashedPassword === user.password) {
            const payload = {
                username: user.username,
                email: user.email,
                role: user.role
            };
            const jwt = this.jwtService.sign(payload);
            return { "access_token": jwt };
        }
        else {
            throw new NotFoundException('Mot de passe incorrect.');
        }
    }
    //Creation d'un utilisateur
    async createUser(userReq: UserEntity, userData: UserRSubscribeDto)
        : Promise<any> {
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
        }
        catch (e) {
            console.log(e.message);
            if (e.errno === 1062) {
                throw new ConflictException('Le username et le email doivent être unique');
            }
            throw new InternalServerErrorException();
        }
    }
    // Confirmation d'un compte
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


}