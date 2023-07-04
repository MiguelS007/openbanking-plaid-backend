import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateTimeService } from 'src/common';
import { PlaidService } from 'src/common/plaid.service';
import { OpenBankingController } from './controllers';
import {
  AccessTokenService,
  AccountsService,
  AuthService,
  BalanceService,
  InstitutionService,
  LinkTokenService,
  TransactionsService,
} from './services';

@Module({
  imports: [HttpModule],
  controllers: [OpenBankingController],
  providers: [
    Logger,
    ConfigService,
    PlaidService,
    DateTimeService,
    LinkTokenService,
    AccessTokenService,
    AuthService,
    InstitutionService,
    AccountsService,
    BalanceService,
    TransactionsService,
  ],
})
export class OpenBankingModule {}
