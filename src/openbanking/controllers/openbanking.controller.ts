import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseController, CorrelationId } from 'src/common';
import { IMessagePayload } from 'src/openbanking/interfaces';
import {
  AccessTokenService,
  AccountsService,
  AuthService,
  InstitutionService,
  LinkTokenService,
  BalanceService,
  TransactionsService,
} from 'src/openbanking/services';

@Controller('open-banking')
export class OpenBankingController extends BaseController {
  constructor(
    protected readonly logger: Logger,
    private readonly linkTokenService: LinkTokenService,
    private readonly accessTokenService: AccessTokenService,
    private readonly authService: AuthService,
    private readonly institutionService: InstitutionService,
    private readonly accountsService: AccountsService,
    private readonly balanceService: BalanceService,
    private readonly transactionsService: TransactionsService,
  ) {
    super(logger);
    this.contextName = OpenBankingController.name;
  }

  @Get('/link-token')
  @ApiOperation({
    summary: 'open banking link token request GET method.',
  })
  @ApiResponse({ status: 400, description: 'BadRequest.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 422, description: 'Unprocessable.' })
  @ApiResponse({ status: 500, description: 'InternalServer.' })
  @ApiResponse({ status: 200, description: 'Published Request' })
  public async createLinkToken(
    @CorrelationId() correlationId: string,
  ): Promise<any> {
    this.correlationId = correlationId;
    return await this.safeExecute(
      async () => await this.linkTokenService.createLinkToken(),
    );
  }

  @Post('/access-token')
  @ApiOperation({
    summary: 'open banking access token request POST method.',
  })
  @ApiResponse({ status: 400, description: 'BadRequest.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 422, description: 'Unprocessable.' })
  @ApiResponse({ status: 500, description: 'InternalServer.' })
  @ApiResponse({ status: 200, description: 'Published Request' })
  public async createAccesToken(
    @CorrelationId() correlationId: string,
    @Body() message: { publicToken: string },
  ): Promise<any> {
    this.correlationId = correlationId;
    return await this.safeExecute(
      async () => await this.accessTokenService.createAccessToken(message),
    );
  }

  @Delete('/access-token')
  @ApiOperation({
    summary: 'open banking access token request DELETE method.',
  })
  @ApiResponse({ status: 400, description: 'BadRequest.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 422, description: 'Unprocessable.' })
  @ApiResponse({ status: 500, description: 'InternalServer.' })
  @ApiResponse({ status: 200, description: 'Published Request' })
  public async deleteAccessToken(
    @CorrelationId() correlationId: string,
    @Body() message: IMessagePayload,
  ): Promise<any> {
    this.correlationId = correlationId;
    return await this.safeExecute(
      async () => await this.accessTokenService.deleteAccessToken(message),
    );
  }

  @Get('/auth')
  @ApiOperation({
    summary: 'open banking auth request GET method.',
  })
  @ApiResponse({ status: 400, description: 'BadRequest.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 422, description: 'Unprocessable.' })
  @ApiResponse({ status: 500, description: 'InternalServer.' })
  @ApiResponse({ status: 200, description: 'Published Request' })
  public async getAuth(
    @CorrelationId() correlationId: string,
    @Body() message: IMessagePayload,
  ): Promise<any> {
    this.correlationId = correlationId;
    return await this.safeExecute(
      async () => await this.authService.getAuth(message),
    );
  }

  @Get('/institution')
  @ApiOperation({
    summary: 'open banking institution request GET method.',
  })
  @ApiResponse({ status: 400, description: 'BadRequest.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 422, description: 'Unprocessable.' })
  @ApiResponse({ status: 500, description: 'InternalServer.' })
  @ApiResponse({ status: 200, description: 'Published Request' })
  public async getInstitution(
    @CorrelationId() correlationId: string,
    @Body() message: IMessagePayload,
  ): Promise<any> {
    this.correlationId = correlationId;
    return await this.safeExecute(
      async () => await this.institutionService.getInstitution(message),
    );
  }

  @Get('/accounts')
  @ApiOperation({
    summary: 'open banking accounts request GET method.',
  })
  @ApiResponse({ status: 400, description: 'BadRequest.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 422, description: 'Unprocessable.' })
  @ApiResponse({ status: 500, description: 'InternalServer.' })
  @ApiResponse({ status: 200, description: 'Published Request' })
  public async getAccounts(
    @CorrelationId() correlationId: string,
    @Body() message: IMessagePayload,
  ): Promise<any> {
    this.correlationId = correlationId;
    return await this.safeExecute(
      async () => await this.accountsService.getAccounts(message),
    );
  }

  @Get('/balance')
  @ApiOperation({
    summary: 'open banking balance request GET method.',
  })
  @ApiResponse({ status: 400, description: 'BadRequest.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 422, description: 'Unprocessable.' })
  @ApiResponse({ status: 500, description: 'InternalServer.' })
  @ApiResponse({ status: 200, description: 'Published Request' })
  public async getBalance(
    @CorrelationId() correlationId: string,
    @Body() message: IMessagePayload,
    @Query('accountId') accountId: string,
  ): Promise<any> {
    this.correlationId = correlationId;
    return await this.safeExecute(
      async () => await this.balanceService.getBalance(message, accountId),
    );
  }

  @Get('/transactions')
  @ApiOperation({
    summary: 'open banking transactions request GET method.',
  })
  @ApiResponse({ status: 400, description: 'BadRequest.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 422, description: 'Unprocessable.' })
  @ApiResponse({ status: 500, description: 'InternalServer.' })
  @ApiResponse({ status: 200, description: 'Published Request' })
  public async getTansactions(
    @CorrelationId() correlationId: string,
    @Body()
    message: IMessagePayload,
    @Query() params: any,
  ): Promise<any> {
    this.correlationId = correlationId;
    return await this.safeExecute(
      async () =>
        await this.transactionsService.getTransactions(
          message,
          params.accountId,
          params.startDate,
          params.endDate,
        ),
    );
  }
}
