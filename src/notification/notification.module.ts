import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppConfigModule } from '@src/config/config.module';
import { PushModule } from '@src/push/push.module';
import { QUEUE_CONSTANTS } from './constants';
import { NotificationController } from './controller/notification.controller';
import { NotificationService, TokenConsumer } from './service';
import { MessageConsumer } from './service/message.consumer';

@Module({
    imports: [
        AppConfigModule,
        BullModule.registerQueue({
            name: QUEUE_CONSTANTS.TOKEN,
            redis: {
                host: process.env.REDIS_LOCAL_HOST,
                port: Number(process.env.REDIS_STAGING_PORT),
                connectTimeout: 5000,
            },
        }),
        BullModule.registerQueue({
            name: QUEUE_CONSTANTS.MESSAGE,
            redis: {
                host: process.env.REDIS_LOCAL_HOST,
                port: Number(process.env.REDIS_STAGING_PORT),
                connectTimeout: 5000,
            },
        }),
        PushModule,
    ],
    controllers: [NotificationController],
    providers: [NotificationService, TokenConsumer, MessageConsumer],
})
export class NotificationModule {}
