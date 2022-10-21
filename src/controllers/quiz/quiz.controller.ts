import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { AuthSupertokensGuard } from '../../auth/auth-supertokens.guard';
import { Quiz } from '../../entities/quiz.entity';
import { QuizService } from '../../quiz/quiz.service';
import { createQuizDtoRequest, QuizDtoResponse, ShowQuizDtoResponse } from '../../quiz/quiz.dto';
import { UserId } from '../../auth/session.decorator';
import { EndpointResponse } from '../../common/utils/serializer';

@ApiTags('Quiz')
@Controller({
  path: 'quiz',
  version: '1'
})
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @UseGuards(AuthSupertokensGuard)
  async createQuiz(@Body() data: createQuizDtoRequest, @UserId() userId: string): EndpointResponse<QuizDtoResponse> {
    return {
      dto: QuizDtoResponse,
      data: await this.quizService.createQuiz({ ...data, createdById: userId })
    };
  }

  @Get(':id')
  async showQuiz(@Param('id') quizId: string): EndpointResponse<ShowQuizDtoResponse> {
    return {
      dto: ShowQuizDtoResponse,
      data: await this.quizService.getById(quizId)
    };
  }

  @Patch(':id')
  @ApiExcludeEndpoint()
  @UseGuards(AuthSupertokensGuard)
  async updateQuiz(@Body() data: Quiz, @Param('id') quizId: string): Promise<any> {
    return await this.quizService.updateQuiz(data, quizId);
  }

  @Get('/history')
  @ApiExcludeEndpoint()
  async getHistory(): Promise<any[]> {
    return await this.quizService.getHistory();
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
