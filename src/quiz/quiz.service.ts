import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { RequiredEntityData } from '@mikro-orm/core';
import { Quiz } from '../entities/quiz.entity';
import { QuizDtoResponse, ShowQuizDtoResponse } from './quiz.dto';

@Injectable()
export class QuizService {
  constructor(private readonly em: EntityManager) {}

  async getById(id: string): Promise<ShowQuizDtoResponse> {
    const quiz = await this.em.fork().findOneOrFail(Quiz, id, { populate: true });
    return {
      ...quiz,
      participants: quiz.players.getItems(),
      questions: quiz.questions.getItems()
    };
  }

  async createQuiz(params: RequiredEntityData<Quiz>): Promise<QuizDtoResponse> {
    const em = this.em.fork();
    const quiz = em.create(Quiz, params);
    await em.persistAndFlush(quiz);
    return quiz;
  }

  async updateQuiz(data: any, id: string): Promise<any> {}
  async getHistory(): Promise<any> {}
  async getRatings(id: string): Promise<any> {}
  async generateLink(id: string): Promise<any> {}
}
