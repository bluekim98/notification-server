import {
    Notification,
    MulticastMessage,
    TokenMessage,
} from '@src/util/fcm.service';

export interface RegistrationTokenJob {
    token: string;
    option: TokenJobOption;
}

export interface RegistrationBulkTokenJob {
    token: string[];
    option: TokenJobOption;
}

export interface TokenJobOption {
    badge: number;
    ttl: number;
    notification: Notification;
    customId?: string;
    data?: Record<string, any>;
    timestamp?: Date;
}

export interface RegistrationMessageJob {
    message: TokenMessage;
}

export interface RegistrationBulkMessageJob {
    message: MulticastMessage;
}
