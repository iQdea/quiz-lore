import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuestionService } from '../../quiz/questions/question.service';
import {
  createQuestionDtoRequest,
  QuestionDtoResponse,
  updateQuestionDtoRequest
} from '../../quiz/questions/question.dto';
import { AuthSupertokensGuard } from '../../auth/auth-supertokens.guard';
import { CollectionResponse, EmptyEndpointResponse, EndpointResponse } from '../../common/utils/serializer';

@ApiTags('Questions')
@Controller({
  path: 'question',
  version: '1'
})
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get(':quiz_id')
  @ApiOperation({ summary: 'Получить вопросы к квизу' })
  async showQuestions(@Param('quiz_id') quizId: string): CollectionResponse<QuestionDtoResponse> {
    return {
      dto: QuestionDtoResponse,
      data: await this.questionService.showQuestions(quizId)
    };
  }

  @Post('')
  @ApiOperation({ summary: 'Создать вопрос к квизу' })
  @UseGuards(AuthSupertokensGuard)
  async createQuestion(@Body() data: createQuestionDtoRequest): EndpointResponse<QuestionDtoResponse> {
    return {
      dto: QuestionDtoResponse,
      data: await this.questionService.createQuestion({ ...data, quiz: data.quizId })
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить вопрос' })
  @UseGuards(AuthSupertokensGuard)
  async updateQuestion(
    @Body() data: updateQuestionDtoRequest,
    @Param('id') questionId: string
  ): EndpointResponse<QuestionDtoResponse> {
    return {
      dto: QuestionDtoResponse,
      data: await this.questionService.updateQuestion(data, questionId)
    };
  }

  @Delete('')
  @ApiOperation({ summary: 'Отвязать вопрос от квиза и отправить в архив' })
  @UseGuards(AuthSupertokensGuard)
  async deleteFromQuiz(
    @Query('question_id') question_id: string,
    @Query('quiz_id') quiz_id: string
  ): EmptyEndpointResponse {
    await this.questionService.removeQuestionFromQuiz(question_id, quiz_id);
  }
}
