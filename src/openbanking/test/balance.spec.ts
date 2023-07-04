import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { BalanceService } from '../services';
import { Configuration, PlaidService } from '../../common';
import { ConfigService } from '@nestjs/config';

describe('OpenBankingService', () => {
  let balanceService: BalanceService;
  let logger: Partial<Logger>;
  let plaidService: Partial<PlaidService>;
  let configService: Partial<ConfigService>;

  beforeEach(async () => {
    configService = {
      get: () => '',
    };
    logger = {
      log: () => {
        return;
      },
      warn: () => {
        return;
      },
      error: () => {
        return;
      },
      debug: () => {
        return;
      },
    };
    plaidService = {};

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        { provide: Logger, useValue: logger },
        { provide: PlaidService, useValue: plaidService },
        { provide: Configuration, useValue: configService },
      ],
    }).compile();

    balanceService = moduleRef.get<BalanceService>(BalanceService);
  });

  it('should be defined', () => {
    expect(balanceService).toBeDefined();
  });
});
