import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PlaidService } from '../../common';
import { CountryCode } from 'plaid';

@Injectable()
export class InstitutionService {
  private readonly contextService = InstitutionService.name;
  private correlationId: string;

  constructor(
    protected readonly logger: Logger,
    private readonly plaidService: PlaidService,
  ) {}

  async getInstitution(message: { accessToken: string }): Promise<any> {
    const { accessToken } = message;

    this.correlationId = randomUUID();

    this.logger.log(
      {
        message: `Function get institution execution started. CorrelationId: ${this.correlationId}`,
        metadata: {
          correlationId: this.correlationId,
          accessToken,
        },
      },
      this.contextService,
    );

    try {
      const plaidClient = this.plaidService.plaidClient;
      const item = await plaidClient.itemGet({
        access_token: 'access-sandbox-6b1987ba-f659-4f79-b9d5-75a71ac33a80',
      });
      const institutionId = item.data.item.institution_id;
      const institution = await plaidClient.institutionsGetById({
        institution_id: institutionId,
        country_codes: [
          CountryCode.Us,
          CountryCode.Gb,
          CountryCode.Es,
          CountryCode.Nl,
          CountryCode.Fr,
          CountryCode.Ie,
          CountryCode.Ca,
        ],
      });

      this.logger.log(
        {
          message: `Function get institution finished with successfully. CorrelationId: ${this.correlationId}`,
          metadata: {
            correlationId: this.correlationId,
            linkToken: institution.data,
          },
        },
        this.contextService,
      );

      return institution.data;
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
