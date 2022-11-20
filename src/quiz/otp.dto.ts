import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class OtpDtoResponse {
  @Expose()
  @ApiProperty()
  code!: string;
}

@Exclude()
export class OtpDtoRequest {
  @Expose()
  @ApiProperty()
  quizId!: string;

  @Expose()
  @ApiProperty()
  privateList?: string[];
}
