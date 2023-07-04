import { ApiProperty } from '@nestjs/swagger';

export class IMessagePayload {
  @ApiProperty()
  accessToken: string;
}
