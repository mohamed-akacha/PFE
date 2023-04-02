import { Controller, UseInterceptors, ClassSerializerInterceptor, Body, HttpException, HttpStatus, Post, Get, Param, Render, InternalServerErrorException, UseGuards, ParseIntPipe, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/decorators/roles.decorator";
import { User } from "src/decorators/user.decorator";
import { AuthService } from "./auth.service";
import { LoginCredentialsDto } from "./dto/login-credentials.dto";
import { UserRSubscribeDto } from "./dto/real-user-create.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity } from "./entities/user.entity";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RoleGuard } from "./guards/rôles.guard";

@ApiTags("Auth")
@ApiBearerAuth()
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor
        (private authService: AuthService) { }
    
    //creation
    @Post('register')
    @Roles('admin')
    @UseGuards(JwtAuthGuard, RoleGuard)
    async createUser(
        @User() userReq: UserEntity,
        @Body() userData: UserRSubscribeDto
    ) {
        try {
        return await this.authService.createUser(userReq, userData);
        } catch (error) {
        throw new InternalServerErrorException('Erreur lors de la création de l\'utilisateur.', error.message);
        }
    }    
    //Login endpoint
    @Post('login')
    async login(@Body() credentials: LoginCredentialsDto) {
        try {
            return await this.authService.login(credentials);
        }
        catch (error) {
            throw new HttpException('Email ou mot de passe incorrect.', HttpStatus.UNAUTHORIZED);
        }
    }
    //confirmation d'un compte
    @Put(':id')
    async confirmAccount(@User() userReq: UserEntity,@Body() userData: UpdateUserDto,
        @Param('id', ParseIntPipe) userId: number){
        try {
        return await this.authService.confirmAccount(userId, userData);
        } catch (error) {
        console.log(error)
        throw new InternalServerErrorException('Erreur lors de la modification de l\'utilisateur.', error.message);
        }
    }
    //Ouverture de la page de confirmation d'un compte
    @Get('confirm/:hashed')
    @Render('confirm')
    async getConfirm(@Param('hashed') hashedId: string) {
        try {
            const decodedHashedId = decodeURIComponent(hashedId);
            const splitHashedId = decodedHashedId.split('_');
            const userId = splitHashedId[splitHashedId.length - 1];
            //envoi du user id vers la page confirmation.hbs
            return { userId };
        } 
        catch (error) {
            return { error };
        }
    }
}