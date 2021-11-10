import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { NotificationService } from '.';
import { v4 as uuidv4 } from 'uuid';

describe('NotificationService', () => {
    let service: NotificationService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = module.get<NotificationService>(NotificationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
