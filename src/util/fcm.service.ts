import * as admin from 'firebase-admin';
import { TokenMessage as FirebaseTokenMessage } from 'firebase-admin/lib/messaging';

import * as moment from 'moment-timezone';
import path = require('path');

export type Message = admin.messaging.Message;
export type MulticastMessage = admin.messaging.MulticastMessage;
export type SendResponse = admin.messaging.SendResponse;
export type Notification = admin.messaging.Notification;
export type TokenMessage = FirebaseTokenMessage;

export class FcmService {
    private static readonly BULK_TOKEN_MAX_COUNT = 500;

    private static readonly FCM = admin.initializeApp({
        credential: admin.credential.cert('config/firebaseConfig.json'),
    });

    static async send(message: Message) {
        return await FcmService.FCM.messaging().send(message);
    }

    static async sendMulticast(message: MulticastMessage) {
        return await FcmService.FCM.messaging().sendMulticast(message);
    }

    static createPayload({
        token,
        data,
        notification,
        ttl,
        badge,
        customId,
    }: PayloadType): TokenMessage {
        const payload: TokenMessage = {
            token,
            data: {
                ...data,
            },
            notification: {
                ...notification,
            },
            android: {
                notification: {
                    notificationCount: badge,
                },
                ttl: ttl ?? Number(moment.duration(7, 'days')),
                data: {
                    ...data,
                },
            },
            apns: {
                headers: {
                    'apns-expiration': ttl
                        ? ttl.toString()
                        : Number(moment.duration(7, 'days')).toString(),
                },
                payload: {
                    aps: {
                        badge,
                        customId,
                    },
                    data: {
                        ...data,
                    },
                },
            },
        };
        return payload;
    }

    static createBulkPayload({
        token,
        data,
        notification,
        ttl,
        badge,
        customId,
    }: BulkPayloadType): MulticastMessage {
        const payload: MulticastMessage = {
            tokens: token,
            data: {
                ...data,
            },
            notification: {
                ...notification,
            },
            android: {
                notification: {
                    notificationCount: badge,
                },
                ttl: ttl ?? Number(moment.duration(7, 'days')),
                data: {
                    ...data,
                },
            },
            apns: {
                headers: {
                    'apns-expiration': ttl
                        ? ttl.toString()
                        : Number(moment.duration(7, 'days')).toString(),
                },
                payload: {
                    aps: {
                        badge,
                        customId,
                    },
                    data: {
                        ...data,
                    },
                },
            },
        };
        return payload;
    }

    static paginationToken(token: string[], maxCount?: number) {
        if (!token.length) throw { statusCode: 400, message: 'token is empty' };
        if (maxCount > FcmService.BULK_TOKEN_MAX_COUNT)
            throw {
                statusCode: 400,
                message: 'maxCount should be less than 500',
            };

        const tokens: string[][] = [];
        const bulkMax = maxCount ?? FcmService.BULK_TOKEN_MAX_COUNT;
        const total = token.length;
        const page = Math.floor((total - 1) / bulkMax) + 1;
        for (let i = 0; i < page; i++) {
            const start = i * bulkMax;
            const end = start + bulkMax;
            const _token = token.slice(start, end);
            tokens.push(_token);
        }

        return tokens;
    }
}

export interface PayloadType {
    token: string;
    badge: number;
    customId: string;
    ttl: number;
    notification: Notification;
    data?: Record<string, any>;
}

export interface BulkPayloadType {
    token: string[];
    badge: number;
    customId: string;
    ttl: number;
    notification: Notification;
    data?: Record<string, any>;
}
