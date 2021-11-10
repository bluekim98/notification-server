import { InjectQueue, Process, Processor } from '@nestjs/bull';
import {
    BulkPayloadType,
    FcmService,
    PayloadType,
} from '@src/util/fcm.service';
import { Job, Queue } from 'bull';
import { QUEUE_CONSTANTS, TASK_CONSTANTS } from '../constants';
import {
    RegistrationBulkMessageJob,
    RegistrationBulkTokenJob,
    RegistrationMessageJob,
    RegistrationTokenJob,
} from '../interface/task.interface';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';

@Processor(QUEUE_CONSTANTS.TOKEN)
export class TokenConsumer {
    private readonly logger = new Logger(TokenConsumer.name);

    constructor(
        @InjectQueue(QUEUE_CONSTANTS.MESSAGE)
        private readonly messageQueue: Queue<
            RegistrationMessageJob | RegistrationBulkMessageJob
        >,
    ) {}

    @Process(TASK_CONSTANTS.TOKEN_ONE)
    async popTaskByToken(job: Job<RegistrationTokenJob>) {
        const { token, option } = job.data;
        const { data, badge, customId, timestamp, notification, ttl } = option;
        return await this.pushMessage({
            token,
            badge,
            customId: customId ?? uuidv4(),
            ttl,
            notification,
            data,
        });
    }

    private async pushMessage(payload: PayloadType) {
        const message = FcmService.createPayload(payload);
        return await this.messageQueue.add(TASK_CONSTANTS.MESSAGE_ONE, {
            message,
        });
    }

    @Process(TASK_CONSTANTS.TOKEN_BULK)
    async popTaskByBulkToken(job: Job<RegistrationBulkTokenJob>) {
        const { token, option } = job.data;
        const { data, badge, customId, timestamp, notification, ttl } = option;
        return await this.pushBulkMessage({
            token,
            badge,
            customId: customId ?? uuidv4(),
            ttl,
            notification,
            data,
        });
    }

    private async pushBulkMessage(payload: BulkPayloadType) {
        const message = FcmService.createBulkPayload(payload);
        return await this.messageQueue.add(TASK_CONSTANTS.MESSAGE_BULK, {
            message,
        });
    }
}
