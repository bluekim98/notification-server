import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { PushService } from '@src/push/push.service';
import { SendResponse } from '@src/util/fcm.service';
import { Job } from 'bull';
import { QUEUE_CONSTANTS, TASK_CONSTANTS } from '../constants';
import {
    MessageTaskSendResponse,
    BulkMessageTaskSendResponse,
} from '../interface';
import {
    RegistrationBulkMessageJob,
    RegistrationMessageJob,
} from '../interface/task.interface';

@Processor(QUEUE_CONSTANTS.MESSAGE)
export class MessageConsumer {
    private readonly logger = new Logger(MessageConsumer.name);

    constructor(private readonly pushService: PushService) {}

    @Process(TASK_CONSTANTS.MESSAGE_ONE)
    async popMessage(
        job: Job<RegistrationMessageJob>,
    ): Promise<MessageTaskSendResponse> {
        const { message } = job.data;

        const { id, isSuccess } = await this.pushService.send(message);

        this.logger.debug({ id, isSuccess });

        return {
            token: message.token,
            isSuccess,
        };
    }

    @Process(TASK_CONSTANTS.MESSAGE_BULK)
    async popBulkMessage(
        job: Job<RegistrationBulkMessageJob>,
    ): Promise<BulkMessageTaskSendResponse> {
        const { message } = job.data;

        const { responses, successCount, failureCount } =
            await this.pushService.sendBulk(message);

        this.logger.debug({ successCount, failureCount });

        if (failureCount === 0)
            return {
                successCount,
                failureCount,
            };

        const failureTokens = this.getFailureTokens(responses, message.tokens);
        return {
            successCount,
            failureCount,
            failureTokens,
        };
    }

    private getFailureTokens(
        responses: SendResponse[],
        tokens: string[],
    ): string[] | undefined {
        const failureTokens: string[] = [];
        responses.forEach((response, idx) => {
            if (response.error) failureTokens.push(tokens[idx]);
        });

        return failureTokens;
    }
}
