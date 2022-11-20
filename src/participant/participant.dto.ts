import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { QuizDtoResponse } from '../quiz/quiz.dto';

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
export class createParticipantDtoRequest {
  @Expose()
  @ApiProperty()
  nick!: string;

  @Expose()
  @ApiProperty()
  code!: string;
}

@Exclude()
export class createParticipantDtoResponse {
  @Expose()
  @ApiProperty()
  id!: string;
  @Expose()
  @ApiProperty()
  quizId!: string;
}

@Exclude()
export class showParticipantDtoResponse {
  @Expose()
  @ApiProperty()
  id!: string;

  @Expose()
  @ApiProperty()
  nick!: string;

  @Expose()
  @Type(() => QuizDtoResponse)
  @ApiProperty({ type: QuizDtoResponse })
  quiz!: QuizDtoResponse;
}
