import { Injectable, Logger } from '@nestjs/common';
import Joi from 'joi';

@Injectable()
export class ValidatorService {
  constructor(private readonly logger: Logger) {}

  public async validateMessagePayload({
    message,
    ValidationObject,
    correlationId,
    contextService,
  }: {
    message: any;
    ValidationObject: Joi.ObjectSchema<any>;
    correlationId: string;
    contextService: string;
  }) {
    try {
      this.logger.debug(
        {
          message: `Prepare to validate message. CorrelationId: ${correlationId}`,
          metadata: {
            correlationId,
          },
        },
        contextService,
      );

      await ValidationObject.validateAsync(message);

      this.logger.debug(
        {
          message: `Payload to pass validation. CorrelationId: ${correlationId}`,
          metadata: {
            correlationId,
          },
        },
        contextService,
      );
    } catch (e) {
      this.logger.error(
        {
          message: 'Payload failed to pass validation\n ' + e.message,
          metadata: {
            correlationId,
          },
        },
        contextService,
      );
      throw 'Payload failed to pass validation';
    }
  }
}
