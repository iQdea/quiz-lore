import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { RequiredEntityData } from '@mikro-orm/core';
import { Question } from '../../entities/question.entity';
import { QuestionDtoResponse, QuestionsDtoResponse } from './question.dto';

@Injectable()
export class QuestionService {
  constructor(private readonly em: EntityManager) {}
  async showQuestions(quiz_id: string): Promise<QuestionsDtoResponse> {
    const questions = await this.em.find(Question, {
      quiz: quiz_id
    });
    return { questions: questions.map((x) => Object.assign(x, { quizId: x.quiz.id })) };
  }
  async createQuestion(params: RequiredEntityData<Question>): Promise<QuestionDtoResponse> {
    const em = this.em.fork();
    const question = em.create(Question, params);
    await em.persistAndFlush(question);
    return { ...question, quizId: question.quiz.id };
  }
  async updateQuestion(data: any, id: string): Promise<any> {}
  async removeQuestion(id: string): Promise<any> {}
}
