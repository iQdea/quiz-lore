import { EntityManager } from '@mikro-orm/postgresql';
import { ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { RequiredEntityData } from '@mikro-orm/core';
import { generate } from 'otp-generator';
import { Quiz } from '../entities/quiz.entity';
import {
  QuizDtoResponse,
  QuizRatingDto,
  saveQuizRatingDtoRequest,
  ShowQuizDtoResponse,
  showRatingsDtoResponse,
  updateQuizDtoRequest
} from './quiz.dto';
import { Otp } from '../entities/otp.entity';
import { OtpDtoRequest, OtpDtoResponse } from './otp.dto';
import { Participant } from '../entities/participant.entity';

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
  async saveRating(data: saveQuizRatingDtoRequest): Promise<QuizRatingDto> {
    const em = this.em.fork();
    const participant = await em.findOneOrFail(Participant, data.participantId);
    participant.assign({ rating: data.rating });
    await em.persistAndFlush(participant);
    return { rating: participant.rating };
  }
  async getRatings(id: string): Promise<showRatingsDtoResponse[]> {
    const em = this.em.fork();
    const participants = await em.find(Participant, { quiz: id });
    return participants.map((x) =>
      Object.assign({}, { participantId: x.id, participantNick: x.nick, rating: x.rating })
    );
  }
  async generateCode(data: OtpDtoRequest, userId: string): Promise<OtpDtoResponse> {
    const em = this.em.fork();
    const quiz = await em.findOneOrFail(Quiz, { id: data.quizId, isActive: true }, { populate: true });
    if (userId !== quiz.createdById) {
      throw new ForbiddenException(`You must be the owner of quiz to share it`);
    }
    if (quiz.questions.length === 0) {
      throw new UnprocessableEntityException(`Cannot share quiz with zero questions`);
    }
    const questions = await quiz.questions.loadItems({ populate: true });
    if (questions.findIndex((x) => x.options.length > 1) === -1) {
      throw new UnprocessableEntityException(`Each question should contain at least 2 options`);
    }
    const code = generate(6);
    const otp = em.create(Otp, { code, ownerId: userId, quizId: data.quizId, privateList: data.privateList ?? [] });
    await em.persistAndFlush(otp);
    return { code: otp.code };
  }
}
