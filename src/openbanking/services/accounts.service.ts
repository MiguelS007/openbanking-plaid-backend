import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PlaidService } from '../../common';

@Injectable()
export class AccountsService {
  private readonly contextService = AccountsService.name;
  private correlationId: string;

  constructor(
    protected readonly logger: Logger,
    private readonly plaidService: PlaidService,
  ) {}

  async getAccounts(message: { accessToken: string }): Promise<any> {
    const { accessToken } = message;

    this.correlationId = randomUUID();

    this.logger.log(
      {
        message: `Function get accounts execution started. CorrelationId: ${this.correlationId}`,
        metadata: {
          correlationId: this.correlationId,
          accessToken,
        },
      },
      this.contextService,
    );

    try {
      const plaidClient = this.plaidService.plaidClient;
      const accounts = await plaidClient.accountsGet({
        access_token: 'access-sandbox-6b1987ba-f659-4f79-b9d5-75a71ac33a80',
      });

      this.logger.log(
        {
          message: `Function get accounts finished with successfully. CorrelationId: ${this.correlationId}`,
          metadata: {
            correlationId: this.correlationId,
            accounts: accounts.data,
          },
        },
        this.contextService,
      );

      return accounts.data;
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
