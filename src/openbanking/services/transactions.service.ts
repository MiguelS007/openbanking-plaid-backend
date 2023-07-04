import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PlaidService } from '../../common';

@Injectable()
export class TransactionsService {
  private readonly contextService = TransactionsService.name;
  private correlationId: string;

  constructor(
    protected readonly logger: Logger,
    private readonly plaidService: PlaidService,
  ) {}

  async getTransactions(
    message: {
      accessToken: string;
    },
    accountId: string,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    this.correlationId = randomUUID();

    this.logger.log(
      {
        message: `Function get transactions execution started. CorrelationId: ${this.correlationId}`,
        metadata: {
          correlationId: this.correlationId,
          accountId,
          message,
        },
      },
      this.contextService,
    );

    try {
      const plaidClient = this.plaidService.plaidClient;
      const transactions = await plaidClient.transactionsGet({
        access_token: 'access-sandbox-6b1987ba-f659-4f79-b9d5-75a71ac33a80',
        start_date: startDate,
        end_date: endDate,
        options: {
          include_personal_finance_category: true,
          account_ids: [accountId],
        },
      });

      const filteredTransactions = transactions.data.transactions.filter(
        (transaction) => transaction.account_id === accountId,
      );

      this.logger.log(
        {
          message: `Function get transactions finished with successfully. CorrelationId: ${this.correlationId}`,
          metadata: {
            correlationId: this.correlationId,
            transactions: transactions.data,
            filteredTransactions,
          },
        },
        this.contextService,
      );

      return filteredTransactions;
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
