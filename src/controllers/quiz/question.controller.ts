import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QuestionService } from '../../quiz/questions/question.service';
import { createQuestionDtoRequest, QuestionDtoResponse, QuestionsDtoResponse } from '../../quiz/questions/question.dto';
import { AuthSupertokensGuard } from '../../auth/auth-supertokens.guard';
import { EndpointResponse } from '../../common/utils/serializer';

@ApiTags('Questions')
@Controller({
  path: 'question',
  version: '1'
})
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('')
  @UseGuards(AuthSupertokensGuard)
  async createQuestion(@Body() data: createQuestionDtoRequest): EndpointResponse<QuestionDtoResponse> {
    return {
      dto: QuestionDtoResponse,
      data: await this.questionService.createQuestion({ ...data, quiz: data.quizId })
    };
  }

  @Get(':quiz_id')
  async showQuestions(@Param('quiz_id') quizId: string): EndpointResponse<QuestionsDtoResponse> {
    return {
      dto: QuestionsDtoResponse,
      data: await this.questionService.showQuestions(quizId)
    };
  }
}
