import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { Helpers } from './helpers';
@Injectable()
export class BaseRequestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: any) {
    let correlationId = req.headers['x-correlation-id'] as string;
    correlationId = correlationId || randomUUID();
    req.headers['x-correlation-id'] = correlationId;
    next();
  }
}

export const CorrelationId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-correlation-id'];
  },
);

export const InternalDocument = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return Helpers.removeNonNumericCharacters(request.params?.document || '');
  },
);
