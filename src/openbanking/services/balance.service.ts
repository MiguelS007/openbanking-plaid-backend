import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PlaidService } from '../../common';

@Injectable()
export class BalanceService {
  private readonly contextService = BalanceService.name;
  private correlationId: string;

  constructor(
    protected readonly logger: Logger,
    private readonly plaidService: PlaidService,
  ) {}

  async getBalance(
    message: {
      accessToken: string;
    },
    accountId: string,
  ): Promise<any> {
    const { accessToken } = message;
    this.correlationId = randomUUID();

    this.logger.log(
      {
        message: `Function get balance execution started. CorrelationId: ${this.correlationId}`,
        metadata: {
          correlationId: this.correlationId,
          accountId,
          accessToken,
        },
      },
      this.contextService,
    );

    try {
      const plaidClient = this.plaidService.plaidClient;
      const balance = await plaidClient.accountsBalanceGet({
        access_token: 'access-sandbox-6b1987ba-f659-4f79-b9d5-75a71ac33a80',
      });

      const filteredBalance = balance.data.accounts.filter(
        (account) => account.account_id === accountId,
      );

      this.logger.log(
        {
          message: `Function get balance finished with successfully. CorrelationId: ${this.correlationId}`,
          metadata: {
            correlationId: this.correlationId,
            balance: balance.data,
            filteredBalance,
          },
        },
        this.contextService,
      );

      return filteredBalance;
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
