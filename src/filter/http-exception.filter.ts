import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(err: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();
        const response = err.response ?? err;
        const statusCode = response?.statusCode ?? 400;
        res.status(statusCode).json({
            statusCode,
            message: response?.message,
            timestamp: new Date().toISOString(),
            path: req.url,
        });
    }
}
