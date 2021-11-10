import { UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

export const HttpException = () => UseFilters(HttpExceptionFilter);
