import { ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationEntity } from './entities/notification.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { Roles } from 'src/decorators/roles.decorator';
@ApiTags("Notifications")
@ApiBearerAuth()
@Controller('notifications')
//@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard,RoleGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':userId')
  @Roles('admin','user')
  async getNotificationsForUser(@Param('userId', ParseIntPipe) userId: number): Promise<NotificationEntity[]> {
    return await this.notificationService.getNotifications(userId);
  }

  @Patch(':notificationId')
  @Roles('admin', 'user')
  async markNotificationAsRead(@Param('notificationId', ParseIntPipe) notificationId: number): Promise<NotificationEntity | null> {
    return await this.notificationService.markNotificationAsRead(notificationId);
  }
}
