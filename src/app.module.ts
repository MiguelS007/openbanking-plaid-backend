import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { Configuration } from './common';
import { OpenBankingModule } from './openbanking/openbanking.module';
import { HealthCheckModule } from './healthcheck/healthcheck.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Configuration.envs],
      isGlobal: true,
      cache: true,
    }),
    TerminusModule,
    HealthCheckModule,
    OpenBankingModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
