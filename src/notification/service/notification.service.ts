import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_CONSTANTS, TASK_CONSTANTS } from '../constants';
import { PushNotificationDto } from '../dto';
import {
    TokenJobOption,
    RegistrationTokenJob,
    RegistrationBulkTokenJob,
} from '../interface/task.interface';
import { FcmService } from '@src/util/fcm.service';

@Injectable()
export class NotificationService {
    constructor(
        @InjectQueue(QUEUE_CONSTANTS.TOKEN)
        private readonly tokenQueue: Queue<
            RegistrationTokenJob | RegistrationBulkTokenJob
        >,
    ) {}

    async pushMessage(
        pushNotificationDto: PushNotificationDto,
    ): Promise<Job[]> {
        const { token: tokens, ...another } = pushNotificationDto;
        const jobs: Job[] = [];
        await Promise.all(
            tokens.map(async (token) => {
                const job = await this.addJob(token, another);
                jobs.push(job);
            }),
        );
        return jobs;
    }

    private async addJob(token: string, option: TokenJobOption): Promise<Job> {
        return await this.tokenQueue.add(TASK_CONSTANTS.TOKEN_ONE, {
            token,
            option,
        });
    }

    async pushBulkMessage(
        pushNotificationDto: PushNotificationDto,
    ): Promise<Job[]> {
        const { token, ...another } = pushNotificationDto;
        const tokens = FcmService.paginationToken(token);
        return await this.addBulkJob(tokens, another);
    }

    private async addBulkJob(
        tokens: string[][],
        option: TokenJobOption,
    ): Promise<Job[]> {
        const jobs = tokens.map((token) => {
            return {
                name: TASK_CONSTANTS.TOKEN_BULK,
                data: {
                    token,
                    option,
                },
            };
        });

        return await this.tokenQueue.addBulk(jobs);
    }
}
