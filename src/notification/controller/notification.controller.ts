import { Body, Controller, Get, Post } from '@nestjs/common';
import { PushNotificationDto } from '../dto';
import { NotificationService } from '../service';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    async pushMessage(@Body() pushNotificationDto: PushNotificationDto) {
        return await this.notificationService.pushBulkMessage(
            pushNotificationDto,
        );
    }

    @Get('test')
    async test() {
        return 'hello world !';
    }

    private __createTestPayload(
        pushNotificationDto: PushNotificationDto,
    ): PushNotificationDto {
        const MY_TEST_TOKEN = process.env.MY_TEST_TOKEN;

        const testDto = {
            ...pushNotificationDto,
        };
        for (const token of testDto.token) {
            testDto.token.pop();
        }

        for (let i = 0; i < 600; i++) {
            testDto.token.push(MY_TEST_TOKEN);
        }

        return testDto;
    }
}
