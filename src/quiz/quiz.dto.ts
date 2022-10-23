import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class QuizDto {
  @Expose()
  @ApiProperty({
    description: 'The title of the quiz'
  })
  @IsNotEmpty({ message: 'The quiz should have a title' })
  @Length(3, 255)
  displayName!: string;

  @Expose()
  @ApiProperty({
    description: 'A small description for the user'
  })
  description?: string;
}
export class createQuizDtoRequest extends QuizDto {}

@Exclude()
export class updateQuizDtoRequest {
  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  @Length(3, 255)
  displayName?: string;

  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  description?: string;
}

@Exclude()
export class QuizDtoResponse extends QuizDto {
  @Expose()
  @ApiProperty()
  id!: string;
}

@Exclude()
export class ParticipantDto {
  @Expose()
  @ApiProperty()
  id!: string;

  @Expose()
  @ApiProperty()
  nick!: string;
}

@Exclude()
export class QuestionDto {
  @Expose()
  @ApiProperty()
  id!: string;

  @Expose()
  @ApiProperty()
  question!: string;
}

@Exclude()
export class ShowQuizDtoResponse extends QuizDtoResponse {
  @Expose()
  @ApiProperty()
  isActive!: boolean;

  @Expose()
  @Type(() => ParticipantDto)
  @ApiProperty({ type: [ParticipantDto] })
  participants?: ParticipantDto[];

  @Expose()
  @Type(() => QuestionDto)
  @ApiProperty({ type: [QuestionDto] })
  questions?: QuestionDto[];
}
