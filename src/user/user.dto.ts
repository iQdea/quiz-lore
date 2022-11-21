import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UpdateUserRequestDto {
  @Expose()
  @ApiProperty()
  firstName?: string;

  @Expose()
  @ApiProperty()
  lastName?: string;

  @Expose()
  @ApiProperty()
  birthDate?: string;
}

@Exclude()
export class quizRatingDtoResponse {
  @Expose()
  @ApiProperty()
  id!: string;

  @Expose()
  @ApiProperty()
  name!: string;

  @Expose()
  @ApiProperty()
  descr!: string;
}
@Exclude()
export class UserRatingDtoResponse {
  @Expose()
  @ApiProperty()
  nick!: string;

  @Expose()
  @ApiProperty()
  rating!: number;

  @Expose()
  @Type(() => quizRatingDtoResponse)
  @ApiProperty({ type: quizRatingDtoResponse })
  quiz!: quizRatingDtoResponse;
}
@Exclude()
export class UserRatingsDtoResponse {
  @Expose()
  @Type(() => UserRatingDtoResponse)
  @ApiProperty({ type: [UserRatingDtoResponse] })
  ratings!: UserRatingDtoResponse[];

  @Expose()
  @ApiProperty()
  summary!: number;
}
@Exclude()
export class UserDtoResponse {
  @Expose()
  @ApiProperty()
  id!: string;

  @Expose()
  @ApiProperty()
  firstName!: string;

  @Expose()
  @ApiProperty()
  lastName!: string;

  @Expose()
  @ApiProperty()
  birthDate!: string;
}
