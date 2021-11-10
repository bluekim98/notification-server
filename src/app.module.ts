import { Module } from '@nestjs/common';
import { PushModule } from './push/push.module';
import { NotificationModule } from './notification/notification.module';
import { AppConfigModule } from './config/config.module';

@Module({
    imports: [AppConfigModule, PushModule, NotificationModule],
})
export class AppModule {}
