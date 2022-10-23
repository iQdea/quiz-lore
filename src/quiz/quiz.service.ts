import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { RequiredEntityData } from '@mikro-orm/core';
import { Quiz } from '../entities/quiz.entity';
import { QuizDtoResponse, ShowQuizDtoResponse, updateQuizDtoRequest } from './quiz.dto';

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

  async getAllByUserId(id: string): Promise<QuizDtoResponse[]> {
    return await this.em.fork().find(Quiz, { createdById: id });
  }

  async getHistory(): Promise<ShowQuizDtoResponse[]> {
    const history = await this.em.fork().find(
      Quiz,
      {
        createdAt: {
          $lt: new Date()
        },
        isActive: false
      },
      { populate: true }
    );
    return history.map((x) =>
      Object.assign(x, { participants: x.players.getItems(), questions: x.questions.getItems() })
    );
  }

  async createQuiz(params: RequiredEntityData<Quiz>): Promise<QuizDtoResponse> {
    const em = this.em.fork();
    const nameExists = await em.find(Quiz, { displayName: params.displayName });
    if (nameExists.length > 0) {
      throw new UnprocessableEntityException(`Name '${params.displayName}' already exists. Please take another one`);
    }
    const quiz = em.create(Quiz, params);
    await em.persistAndFlush(quiz);
    return quiz;
  }

  async updateQuiz(data: updateQuizDtoRequest, id: string): Promise<QuizDtoResponse> {
    const em = this.em.fork();
    const quiz = await em.findOneOrFail(Quiz, id);
    quiz.assign(data);
    await em.persistAndFlush(quiz);
    return quiz;
  }
  async getRatings(id: string): Promise<any> {}
  async generateLink(id: string): Promise<any> {}
}
