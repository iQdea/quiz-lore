import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class Option {
  @Expose()
  @ApiProperty({
    description: 'The option for a question'
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  text!: string;

  @Expose()
  @ApiProperty({
    description: 'The ID of the question'
  })
  @IsString()
  @IsUUID('4')
  @IsNotEmpty()
  questionId!: string;

  @Expose()
  @ApiProperty({
    description: 'Whether the option is answer or not',
    example: true
  })
  @IsBoolean()
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
export class updateOptionDtoRequest {
  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 255)
  text?: string;

  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isAnswer?: boolean;
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
