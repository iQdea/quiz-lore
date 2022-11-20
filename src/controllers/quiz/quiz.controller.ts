import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthSupertokensGuard } from '../../auth/auth-supertokens.guard';
import { QuizService } from '../../quiz/quiz.service';
import {
  createQuizDtoRequest,
  QuizDtoResponse,
  QuizRatingDto,
  saveQuizRatingDtoRequest,
  ShowQuizDtoResponse,
  showRatingsDtoResponse,
  updateQuizDtoRequest
} from '../../quiz/quiz.dto';
import { UserId } from '../../auth/session.decorator';
import { CollectionResponse, EndpointResponse } from '../../common/utils/serializer';
import { OtpDtoRequest, OtpDtoResponse } from '../../quiz/otp.dto';

@ApiTags('Quiz')
@Controller({
  path: 'quiz',
  version: '1'
})
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('/user_collection')
  @ApiOperation({ summary: 'Получить все квизы пользователя (где он создатель)' })
  @UseGuards(AuthSupertokensGuard)
  async showAllForUser(@UserId() userId: string): CollectionResponse<QuizDtoResponse> {
    return {
      dto: QuizDtoResponse,
      data: await this.quizService.getAllByUserId(userId)
    };
  }

  @Get('/history')
  @ApiOperation({ summary: 'Получить историю начавшихся или прошедших квизов' })
  async getHistory(): CollectionResponse<ShowQuizDtoResponse> {
    return {
      dto: ShowQuizDtoResponse,
      data: await this.quizService.getHistory()
    };
  }

  @Get('/ratings')
  @ApiOperation({ summary: 'Получить статистику' })
  async getRatings(@Query('quizId') quizId: string): CollectionResponse<showRatingsDtoResponse> {
    return {
      dto: showRatingsDtoResponse,
      data: await this.quizService.getRatings(quizId)
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить квиз по id' })
  async showQuiz(@Param('id') quizId: string): EndpointResponse<ShowQuizDtoResponse> {
    return {
      dto: ShowQuizDtoResponse,
      data: await this.quizService.getById(quizId)
    };
  }

  @Post()
  @ApiOperation({ summary: 'Создать квиз' })
  @UseGuards(AuthSupertokensGuard)
  async createQuiz(@Body() data: createQuizDtoRequest, @UserId() userId: string): EndpointResponse<QuizDtoResponse> {
    return {
      dto: QuizDtoResponse,
      data: await this.quizService.createQuiz({ ...data, createdById: userId })
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить квиз по id' })
  @UseGuards(AuthSupertokensGuard)
  async updateQuiz(@Body() data: updateQuizDtoRequest, @Param('id') quizId: string): EndpointResponse<QuizDtoResponse> {
    return {
      dto: QuizDtoResponse,
      data: await this.quizService.updateQuiz(data, quizId)
    };
  }

  @Post('/share')
  @ApiOperation({ summary: 'Поделиться квизом' })
  @UseGuards(AuthSupertokensGuard)
  async generateCode(@Body() data: OtpDtoRequest, @UserId() userId: string): EndpointResponse<OtpDtoResponse> {
    return {
      dto: OtpDtoResponse,
      data: await this.quizService.generateCode(data, userId)
    };
  }

  @Post('/ratings')
  @ApiOperation({ summary: 'Сохранить результат' })
  @UseGuards(AuthSupertokensGuard)
  async setRatings(@Body() data: saveQuizRatingDtoRequest): EndpointResponse<QuizRatingDto> {
    return {
      dto: QuizRatingDto,
      data: await this.quizService.saveRating(data)
    };
  }
}
