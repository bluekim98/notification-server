import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { NotificationController } from './notification.controller';

describe('NotificationController', () => {
    let controller: NotificationController;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        controller = module.get<NotificationController>(NotificationController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
