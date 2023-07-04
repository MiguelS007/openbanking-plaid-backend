import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

@Injectable()
export class PlaidService {
  private readonly plaidClientApi: PlaidApi;
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    const plaidConfiguration = this.getConfiguration();
    this.plaidClientApi = new PlaidApi(plaidConfiguration);
  }

  private getConfiguration(): Configuration {
    return new Configuration({
      basePath: PlaidEnvironments[this.configService.get('plaid.env')],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': this.configService.get('plaid.clientId'),
          'PLAID-SECRET': this.configService.get('plaid.clientSecret'),
          'Plaid-Version': '2020-09-14',
        },
      },
    });
  }

  get plaidClient() {
    return this.plaidClientApi;
  }
}
