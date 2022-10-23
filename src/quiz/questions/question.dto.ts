import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
class Question {
  @Expose()
  @ApiProperty({
    description: 'The actual question',
    example: 'A sample question'
  })
  @IsNotEmpty()
  @Length(3, 255)
  question!: string;

  @Expose()
  @ApiProperty({
    description: 'The quiz id to which the question is associated.'
  })
  @IsNotEmpty()
  quizId!: string;
}
export class createQuestionDtoRequest extends Question {}

@Exclude()
export class updateQuestionDtoRequest {
  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 255)
  question!: string;
}

@Exclude()
export class QuestionDtoResponse extends Question {
  @Expose()
  @ApiProperty()
  id!: string;
}
