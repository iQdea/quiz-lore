import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthSupertokensGuard } from '../auth/auth-supertokens.guard';
import { RequiredEntityData } from '@mikro-orm/core';
import { Quiz } from '../entities/quiz.entity';
import { QuizService } from '../quiz/quiz.service';

@ApiTags('Quiz')
@Controller({
  path: 'quiz',
  version: '1'
})
export class QuizController {
  constructor(private readonly quizService: QuizService) {}
  @Post()
  @UseGuards(AuthSupertokensGuard)
  async createQuiz(@Body('data') data: RequiredEntityData<Quiz>): Promise<any> {
    return await this.quizService.createQuiz(data);
  }

  @Patch()
  @UseGuards(AuthSupertokensGuard)
  async updateQuiz(@Body('data') data: Quiz): Promise<any> {
    return await this.quizService.updateQuiz(data);
  }

  @Get('/history')
  async getHistory(): Promise<any[]> {
    return await this.quizService.getHistory();
  }

  @Get('/ratings')
  async getRatings(@Param('id') quizId: string): Promise<any> {
    return await this.quizService.getRatings(quizId);
  }

  @Post('/share')
  @UseGuards(AuthSupertokensGuard)
  async generateLink(@Param('id') quizId: string): Promise<any> {
    return await this.quizService.generateLink(quizId);
  }
}
