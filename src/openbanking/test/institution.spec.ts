import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { InstitutionService } from '../services';
import { Configuration, PlaidService } from '../../common';
import { ConfigService } from '@nestjs/config';

describe('OpenBankingService', () => {
  let institutionService: InstitutionService;
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
        InstitutionService,
        { provide: Logger, useValue: logger },
        { provide: PlaidService, useValue: plaidService },
        { provide: Configuration, useValue: configService },
      ],
    }).compile();

    institutionService = moduleRef.get<InstitutionService>(InstitutionService);
  });

  it('should be defined', () => {
    expect(institutionService).toBeDefined();
  });
});
