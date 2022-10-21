import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, ValidateNested } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class Option {
  @Expose()
  @ApiProperty({
    description: 'The option for a question'
  })
  @IsNotEmpty()
  @Length(2, 255)
  text!: string;

  @Expose()
  @ApiProperty({
    description: 'The ID of the question'
  })
  @IsNotEmpty()
  questionId!: string;

  @Expose()
  @ApiProperty({
    description: 'Whether the option is answer or not',
    example: true
  })
  @IsNotEmpty()
  isAnswer!: boolean;
}

@Exclude()
export class createOptionsDtoRequest {
  @Expose()
  @Type(() => Option)
  @ApiProperty({ type: [Option] })
  @ValidateNested({ each: true })
  options!: Option[];
}

@Exclude()
export class ShowOption {
  @Expose()
  @ApiProperty()
  id!: string;

  @Expose()
  @ApiProperty()
  text!: string;

  @Expose()
  @ApiProperty()
  questionId!: string;

  @Expose()
  @ApiProperty()
  isAnswer!: boolean;
}

@Exclude()
export class OptionsDtoResponse {
  @Expose()
  @Type(() => ShowOption)
  @ApiProperty({ type: [ShowOption] })
  options!: ShowOption[];
}
