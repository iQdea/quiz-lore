import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { RequiredEntityData } from '@mikro-orm/core';
import { Question } from '../../entities/question.entity';
import { QuestionDtoResponse, updateQuestionDtoRequest } from './question.dto';
import { Quiz } from '../../entities/quiz.entity';

@Injectable()
export class QuestionService {
  constructor(private readonly em: EntityManager) {}
  async showQuestions(quiz_id: string): Promise<QuestionDtoResponse[]> {
    const questions = await this.em.find(Question, {
      quiz: quiz_id
    });
    return questions.map((x) => Object.assign(x, { quizId: x.quiz.id }));
  }
  async createQuestion(params: RequiredEntityData<Question>): Promise<QuestionDtoResponse> {
    const em = this.em.fork();
    const question = em.create(Question, params);
    await em.persistAndFlush(question);
    return { ...question, quizId: question.quiz.id };
  }
  async updateQuestion(data: updateQuestionDtoRequest, id: string): Promise<QuestionDtoResponse> {
    const em = this.em.fork();
    const question = await em.findOneOrFail(Question, id);
    question.assign(data);
    await em.persistAndFlush(question);
    return { ...question, quizId: question.quiz.id };
  }
  async removeQuestionFromQuiz(question_id: string, quiz_id: string): Promise<void> {
    const em = this.em.fork();
    const question = await em.findOneOrFail(Question, question_id);
    const quiz = await em.findOneOrFail(Quiz, quiz_id, { populate: ['questions'] });
    quiz.questions.remove(question);
    await em.flush();
  }
}
