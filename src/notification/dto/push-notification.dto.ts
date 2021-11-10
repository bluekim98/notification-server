import {
    ArrayMinSize,
    IsArray,
    IsDate,
    IsNotEmptyObject,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { Notification } from '@src/util/fcm.service';

export class PushNotificationDto {
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    token: string[];

    @IsNumber()
    badge: number;

    @IsNumber()
    ttl: number;

    @IsNotEmptyObject()
    notification: Notification;

    @IsString()
    @IsOptional()
    customId?: string;

    @IsOptional()
    data?: Record<string, any>;

    @IsDate()
    @IsOptional()
    timestamp?: Date;
}
