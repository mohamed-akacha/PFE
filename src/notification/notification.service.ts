import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceToken } from './entities/device_tokens.entity';
import * as admin from 'firebase-admin';
import { NotificationEntity } from './entities/notification.entity';


@Injectable()
export class NotificationService {
  constructor(
    @Inject('FIREBASE') private firebaseAdmin: admin.app.App,
    @InjectRepository(DeviceToken)
    private deviceTokenRepository: Repository<DeviceToken>,
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>) {}

    async sendToUser(userId: number, title: string, body: string , inspectionId: number) {
      // Get the device token(s) for the user
      const tokens = await this.getUserDeviceTokens(userId);
    
      if (!tokens.length) {
        console.log(`User ${userId} does not have any registered devices.`);
        return;
      }
    
      // Define the notification
      const messages = tokens.map((token) => ({
        notification: {
          title: title,
          body: body,
        },
        data: {
          inspectionId: inspectionId.toString(),
        },
        token,
      }));
    
      // Send the notifications
for (const message of messages) {
  try {
    await this.firebaseAdmin.messaging().send(message);
  } catch (error) {
    console.log('Failed to send notification:', error);
    // If the error is due to an invalid or not registered token, delete it from the database
    if (error.code === 'messaging/invalid-registration-token' || error.code === 'messaging/registration-token-not-registered') {
      this.deviceTokenRepository.delete({ token: message.token });
    }
  }
}


      // Save the notification in the database
  await this.saveNotification(userId, title, body ,  inspectionId);
    }
    

  private async getUserDeviceTokens(userId: number): Promise<string[]> {
    const deviceTokens = await this.deviceTokenRepository.find({ where: { userId: userId }});
    return deviceTokens.map(deviceToken => deviceToken.token);
  }

  async addDeviceToken(userId: number, newToken: string) {
    const existingToken = await this.deviceTokenRepository.findOne({ where: { userId: userId, token: newToken } });
    if (!existingToken) {
      const deviceToken = this.deviceTokenRepository.create({ token: newToken, userId: userId });
      await this.deviceTokenRepository.save(deviceToken);
    }
  }

  async saveNotification(userId: number, title: string, body: string, inspectionId: number): Promise<NotificationEntity> {
    // Create a new notification with the provided title, body, user id, and inspection id
    const notification = this.notificationRepository.create({
      title,
      body,
      user: { id: userId },
      inspectionId,
    });
  
    // Save the notification in the database
    return await this.notificationRepository.save(notification);
  }
  
  async getNotifications(userId: number): Promise<NotificationEntity[]> {
    // Retrieve all notifications for the specified user
    return await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoin('notification.user', 'user')
      .select([ 'notification.id', 'notification.read', 'notification.title', 'notification.body' ,'notification.inspectionId','notification.createdAt'])
      .where('user.id = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .getMany();
}

async markNotificationAsRead(notificationId: number): Promise<NotificationEntity | null> {
  // Update the 'read' attribute of the notification
  const updateResult = await this.notificationRepository
    .createQueryBuilder()
    .update(NotificationEntity)
    .set({ read: true })
    .where("id = :notificationId", { notificationId })
    .execute();

  // Check if the notification was updated successfully
  if (updateResult.affected === 0) {
    return null; // Return null if the notification doesn't exist
  }

  // Retrieve the updated notification from the database
  const updatedNotification = await this.notificationRepository.findOne({ where: { id: notificationId } });

  return updatedNotification;
}



  
}
