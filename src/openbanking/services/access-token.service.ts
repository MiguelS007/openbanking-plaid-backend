import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PlaidService } from '../../common';

@Injectable()
export class AccessTokenService {
  private readonly contextService = AccessTokenService.name;
  private correlationId: string;
  private readonly plaidClient = this.plaidService.plaidClient;

  constructor(
    protected readonly logger: Logger,
    private readonly plaidService: PlaidService,
  ) {}

  async createAccessToken(message: { publicToken: string }): Promise<any> {
    const { publicToken } = message;

    this.correlationId = randomUUID();

    this.logger.log(
      {
        message: `Function access token execution started. CorrelationId: ${this.correlationId}`,
        metadata: {
          correlationId: this.correlationId,
          publicToken,
        },
      },
      this.contextService,
    );

    try {
      const accessToken = await this.plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });

      this.logger.log(
        {
          message: `Function got access token finished with successfully. CorrelationId: ${this.correlationId}`,
          metadata: {
            correlationId: this.correlationId,
            accessToken: accessToken.data,
          },
        },
        this.contextService,
      );

      return accessToken.data;
    } catch (e) {
      this.logger.warn(
        {
          message: `Function finished prematurely. CorrelationId: ${this.correlationId}.`,
          metadata: {
            correlationId: this.correlationId,
            errorMessage: e.message || e,
            errorName: e.name,
            stackTrace: e.stack,
          },
        },
        this.contextService,
      );

      throw e;
    }
  }

  async deleteAccessToken(message: { accessToken: string }): Promise<any> {
    const { accessToken } = message;

    this.correlationId = randomUUID();

    this.logger.log(
      {
        message: `Function delete access token execution started. CorrelationId: ${this.correlationId}`,
        metadata: {
          correlationId: this.correlationId,
          accessToken,
        },
      },
      this.contextService,
    );

    try {
      // await this.validatorService.validateMessagePayload({
      //   message,
      //   ValidationObject: MessageValidator,
      //   correlationId: this.correlationId,
      //   contextService: this.contextService,
      // });

      const response = await this.plaidClient.itemAccessTokenInvalidate({
        access_token: accessToken,
      });

      this.logger.log(
        {
          message: `Function delete access token finished with successfully. CorrelationId: ${this.correlationId}`,
          metadata: {
            correlationId: this.correlationId,
            accessToken,
          },
        },
        this.contextService,
      );

      return response.data;
    } catch (e) {
      this.logger.warn(
        {
          message: `Function finished prematurely. CorrelationId: ${this.correlationId}.`,
          metadata: {
            correlationId: this.correlationId,
            errorMessage: e.message || e,
            errorName: e.name,
            stackTrace: e.stack,
          },
        },
        this.contextService,
      );

      throw e;
    }
  }
}
