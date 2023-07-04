import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { BaseResponse } from './base.response';

export class BaseController {
  protected contextName: string;
  protected correlationId: string;
  constructor(protected readonly logger: Logger) {}

  public async safeExecute(action: any): Promise<any> {
    try {
      this.callInitLogger();

      const data = await action();

      this.callEndLogger();

      return new BaseResponse(data);
    } catch (error) {
      const response = new BaseResponse();
      const statusCode = this.getStatusCode(error);
      this.callLoggerError(error);
      const httpException = this.getErrorFlowFromStatusCode(error?.message)[
        statusCode
      ];
      if (httpException) throw httpException(response);
      this.callGenericErrorFlow(response);
    }
  }

  private callEndLogger() {
    this.logger.debug(
      {
        message: `Finalizing request from correlation: ${this.correlationId}`,
        metadata: {
          correlationId: this.correlationId,
        },
      },
      this.contextName,
    );
  }

  private callInitLogger() {
    this.logger.debug(
      {
        message: `Initializing request from correlation: ${this.correlationId}`,
        metadata: {
          correlationId: this.correlationId,
        },
      },
      this.contextName,
    );
  }

  private callGenericErrorFlow(response: BaseResponse<unknown>) {
    response.addError({
      message: 'Internal Server Error',
    });

    throw new InternalServerErrorException(response);
  }

  private callLoggerError(error: any) {
    this.logger.error(error);
    this.logger.error(
      {
        message: `Terminating request prematurely from correlation: ${this.correlationId}`,
        metadata: {
          correlationId: this.correlationId,
        },
      },
      this.contextName,
    );
  }

  private getStatusCode(error: any) {
    return (
      error.response?.statusCode ||
      error.response?.status ||
      error?.status ||
      500
    );
  }

  private getErrorFlowFromStatusCode(message?: any) {
    return {
      ...this.loadBadRequestFlow(message),
      ...this.loadUnprocessableEntityFlow(message),
      ...this.loadUnauthorizedFlow(message),
    };
  }

  private loadBadRequestFlow(message?: any) {
    return {
      400: (response) => {
        response.addError({
          message: message ?? 'Request has structure errors',
        });
        return new BadRequestException(response);
      },
    };
  }

  private loadUnprocessableEntityFlow(message?: any) {
    return {
      422: (response) => {
        response.addError({
          message: message ?? 'Request has structure errors',
        });
        return new UnprocessableEntityException(response);
      },
    };
  }

  private loadUnauthorizedFlow(message?: any) {
    return {
      401: (response) => {
        response.addError({
          message: message ?? 'Not Authorized',
        });
        return new UnauthorizedException(response);
      },
    };
  }
}
