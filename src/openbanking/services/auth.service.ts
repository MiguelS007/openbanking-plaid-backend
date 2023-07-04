import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PlaidService } from '../../common';

@Injectable()
export class AuthService {
  private readonly contextService = AuthService.name;
  private correlationId: string;

  constructor(
    protected readonly logger: Logger,
    private readonly plaidService: PlaidService,
  ) {}

  async getAuth(message: { accessToken: string }): Promise<any> {
    const { accessToken } = message;

    this.correlationId = randomUUID();

    this.logger.log(
      {
        message: `Function get auth execution started. CorrelationId: ${this.correlationId}`,
        metadata: {
          correlationId: this.correlationId,
          accessToken,
        },
      },
      this.contextService,
    );

    try {
      const plaidClient = this.plaidService.plaidClient;
      const auth = await plaidClient.itemGet({
        access_token: 'access-sandbox-6b1987ba-f659-4f79-b9d5-75a71ac33a80',
      });
      const authResponse = {
        status_code: auth.data.status,
        request_id: auth.data.request_id,
        description: 'Authorized',
      };

      this.logger.log(
        {
          message: `Function get auth finished with successfully. CorrelationId: ${this.correlationId}`,
          metadata: {
            correlationId: this.correlationId,
            linkToken: auth.data,
          },
        },
        this.contextService,
      );

      return authResponse;
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
