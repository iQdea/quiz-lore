import { UserService } from '../user/user.service';
import { UserId } from '../auth/session.decorator';
import { AuthSupertokensGuard } from '../auth/auth-supertokens.guard';
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserRequestDto, UserDtoResponse, UserRatingsDtoResponse } from '../user/user.dto';
import { EndpointResponse } from '../common/utils/serializer';

@ApiTags('User')
@Controller({
  path: 'user',
  version: '1'
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Получить информацию о пользователе по id' })
  @UseGuards(AuthSupertokensGuard)
  async getUser(@UserId() userId: string): EndpointResponse<UserDtoResponse> {
    return {
      dto: UserDtoResponse,
      data: await this.userService.showUser(userId)
    };
  }
  @Get('/ratings')
  @ApiOperation({ summary: 'Получить рейтинги пользователя по квизам' })
  @UseGuards(AuthSupertokensGuard)
  async getRatings(@UserId() userId: string): EndpointResponse<UserRatingsDtoResponse> {
    return {
      dto: UserRatingsDtoResponse,
      data: await this.userService.showUserRating(userId)
    };
  }

  @Patch()
  @ApiOperation({ summary: 'Обновить информацию о пользователе по id' })
  @UseGuards(AuthSupertokensGuard)
  async updateUser(@UserId() userId: string, @Body() data: UpdateUserRequestDto): EndpointResponse<UserDtoResponse> {
    return {
      dto: UserDtoResponse,
      data: await this.userService.updateUser(data, userId)
    };
  }
}
