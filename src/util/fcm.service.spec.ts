import { v4 as uuidv4 } from 'uuid';
import { FcmService } from './fcm.service';

describe('FcmService', () => {
    it('paging test', () => {
        try {
            FcmService.paginationToken([]);
        } catch (error) {
            expect(error.statusCode).toBe(400);
        }

        try {
            FcmService.paginationToken(['123'], 500);
        } catch (error) {
            expect(error.statusCode).toBe(400);
        }

        const token: string[] = [];
        const totalSize = 200;
        for (let i = 0; i < totalSize; i++) {
            token.push(uuidv4());
        }

        const tokens = FcmService.paginationToken(token);
        const page = Math.floor((totalSize - 1) / 500) + 1;
        expect(tokens.length).toBe(page);

        const totalTokens: string[] = [];
        tokens.forEach((token) => {
            totalTokens.push(...token);
        });

        expect(totalTokens.length).toBe(totalSize);
        const set = new Set(totalTokens);
        expect(set.size).toBe(totalSize);
    });
});
