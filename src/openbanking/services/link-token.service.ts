import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PlaidService } from '../../common';
import { CountryCode, Products } from 'plaid';

@Injectable()
export class LinkTokenService {
  private readonly contextService = LinkTokenService.name;
  private correlationId: string;

  constructor(
    protected readonly logger: Logger,
    private readonly plaidService: PlaidService,
  ) {}

  async createLinkToken(): Promise<any> {
    this.correlationId = randomUUID();

    this.logger.log(
      {
        message: `Function get link token execution started. CorrelationId: ${this.correlationId}`,
        metadata: {
          correlationId: this.correlationId,
        },
      },
      this.contextService,
    );

    try {
      const plaidClient = this.plaidService.plaidClient;
      const linkToken = await plaidClient.linkTokenCreate({
        user: {
          client_user_id: '1',
        },
        client_name: 'Plaid Test App',
        products: [Products.Auth],
        country_codes: [CountryCode.Us],
        language: 'en',
        webhook: 'https://webhook.sample.com',
      });

      this.logger.log(
        {
          message: `Function got link token finished with successfully. CorrelationId: ${this.correlationId}`,
          metadata: {
            correlationId: this.correlationId,
            linkToken: linkToken.data,
          },
        },
        this.contextService,
      );

      return linkToken.data;
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
