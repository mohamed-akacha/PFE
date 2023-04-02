import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { UserRoleEnum } from './enums/user-role.enum';
import { UserSubscribeDto } from './user/dto/user-subscribe.dto';
import { UserService } from './user/user.service';

@Injectable()
export class AdminSeed implements OnModuleInit {
    constructor(
        private userService: UserService
      ) {
      }
  
  async onModuleInit() {
    // Place your initialization code here
    const x=this.userService.usersCount();
    x.then(async (value) => {
        console.log(value);
        // value is the number returned by the Promise
        if(value===0)
       { const adminUser: UserSubscribeDto = {
            username: 'Admin',
            tel: '96505769',
            email: 'admin@example.com',
            password: 'admin123',
            role: UserRoleEnum.ADMIN,  
          };
          try { 
            await this.userService.seedUser(adminUser);
            console.log('Admin user created successfully.'); 
          } catch (error) {
            console.log('Error seeding admin user.', error.message);
          }}
      });
    
  }
}

