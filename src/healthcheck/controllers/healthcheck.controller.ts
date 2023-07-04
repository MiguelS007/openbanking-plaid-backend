import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller('health')
@ApiTags('health')
export class HealthCheckController {
  constructor(private readonly _health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Verify health application',
  })
  @ApiResponse({ status: 200, description: 'Healthy' })
  async get() {
    return await this._health.check([]);
  }
}
