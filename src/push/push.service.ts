import { Injectable } from '@nestjs/common';
import { FcmService, Message, MulticastMessage } from '@src/util/fcm.service';

@Injectable()
export class PushService {
    async send(payload: Message) {
        const response = await FcmService.send(payload);
        const isSuccess = response ? true : false;
        return {
            id: response,
            isSuccess,
        };
    }

    async sendBulk(payload: MulticastMessage) {
        const response = await FcmService.sendMulticast(payload);
        return response;
    }
}
