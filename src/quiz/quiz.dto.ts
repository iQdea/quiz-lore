import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ParticipantDto } from '../participant/participant.dto';

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

  @Expose()
  @ApiPropertyOptional()
  maxPlayers?: number;
}
@Exclude()
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

  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  maxPlayers?: number;
}

@Exclude()
export class QuizDtoResponse extends QuizDto {
  @Expose()
  @ApiProperty()
  id!: string;

  @Expose()
  @ApiProperty()
  isActive!: boolean;
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
  @Type(() => ParticipantDto)
  @ApiProperty({ type: [ParticipantDto] })
  participants?: ParticipantDto[];

  @Expose()
  @Type(() => QuestionDto)
  @ApiProperty({ type: [QuestionDto] })
  questions?: QuestionDto[];
}

@Exclude()
export class saveQuizRatingDtoRequest {
  @Expose()
  @ApiProperty()
  rating!: number;

  @Expose()
  @ApiProperty()
  participantId!: string;
}

@Exclude()
export class QuizRatingDto {
  @Expose()
  @ApiProperty()
  rating?: number;
}

@Exclude()
export class showRatingsDtoResponse extends QuizRatingDto {
  @Expose()
  @ApiProperty()
  participantId!: string;

  @Expose()
  @ApiProperty()
  participantNick!: string;
}
