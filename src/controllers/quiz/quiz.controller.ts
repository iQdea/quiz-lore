import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { AuthSupertokensGuard } from '../../auth/auth-supertokens.guard';
import { QuizService } from '../../quiz/quiz.service';
import { createQuizDtoRequest, QuizDtoResponse, ShowQuizDtoResponse, updateQuizDtoRequest } from '../../quiz/quiz.dto';
import { UserId } from '../../auth/session.decorator';
import { CollectionResponse, EndpointResponse } from '../../common/utils/serializer';

@ApiTags('Quiz')
@Controller({
  path: 'quiz',
  version: '1'
})
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('/user_collection')
  @UseGuards(AuthSupertokensGuard)
  async showAllForUser(@UserId() userId: string): CollectionResponse<QuizDtoResponse> {
    return {
      dto: QuizDtoResponse,
      data: await this.quizService.getAllByUserId(userId)
    };
  }

  @Get('/history')
  async getHistory(): CollectionResponse<ShowQuizDtoResponse> {
    return {
      dto: ShowQuizDtoResponse,
      data: await this.quizService.getHistory()
    };
  }

  @Get(':id')
  async showQuiz(@Param('id') quizId: string): EndpointResponse<ShowQuizDtoResponse> {
    return {
      dto: ShowQuizDtoResponse,
      data: await this.quizService.getById(quizId)
    };
  }

  @Post()
  @UseGuards(AuthSupertokensGuard)
  async createQuiz(@Body() data: createQuizDtoRequest, @UserId() userId: string): EndpointResponse<QuizDtoResponse> {
    return {
      dto: QuizDtoResponse,
      data: await this.quizService.createQuiz({ ...data, createdById: userId })
    };
  }

  @Patch(':id')
  @UseGuards(AuthSupertokensGuard)
  async updateQuiz(@Body() data: updateQuizDtoRequest, @Param('id') quizId: string): EndpointResponse<QuizDtoResponse> {
    return {
      dto: QuizDtoResponse,
      data: await this.quizService.updateQuiz(data, quizId)
    };
  }

  @Get('/ratings')
  @ApiExcludeEndpoint()
  async getRatings(@Param('id') quizId: string): Promise<any> {
    return await this.quizService.getRatings(quizId);
  }

  @Post('/share')
  @UseGuards(AuthSupertokensGuard)
  @ApiExcludeEndpoint()
  async generateLink(@Param('id') quizId: string): Promise<any> {
    return await this.quizService.generateLink(quizId);
  }
}
