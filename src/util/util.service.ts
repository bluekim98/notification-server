export class UtilService {
    static encode(text: string, { type }: { type: 'base64' }) {
        return Buffer.from(text).toString(type);
    }
}
