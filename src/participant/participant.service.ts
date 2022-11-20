import { EntityManager } from '@mikro-orm/postgresql';
import { ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Participant } from '../entities/participant.entity';
import { Otp } from '../entities/otp.entity';
import { Quiz } from '../entities/quiz.entity';
import {
  createParticipantDtoRequest,
  createParticipantDtoResponse,
  showParticipantDtoResponse
} from './participant.dto';

@Injectable()
export class ParticipantService {
  constructor(private readonly em: EntityManager) {}
  async showParticipant(id: string): Promise<showParticipantDtoResponse> {
    const participant = await this.em.fork().findOneOrFail(Participant, id);
    const quiz = await this.em.fork().findOneOrFail(Quiz, { id: participant.quiz.id });
    return { ...participant, quiz };
  }

  async connect(data: createParticipantDtoRequest, userId: string): Promise<createParticipantDtoResponse> {
    const em = this.em.fork();
    const codeExists = await em.findOneOrFail(
      Otp,
      { code: { $eq: data.code } },
      {
        failHandler: () =>
          new UnprocessableEntityException(`Code '${data.code}' does not exist. Please check it for correctness`)
      }
    );
    const isOwner = codeExists.ownerId === userId;
    if (isOwner) {
      throw new UnprocessableEntityException(`Owner cannot be participant`);
    }
    if (codeExists.privateList.length > 0) {
      const isIncluded = codeExists.privateList.includes(userId);
      if (!isIncluded) {
        throw new ForbiddenException(`You have no permissions to use this code`);
      }
    }
    const quiz = await em.findOneOrFail(Quiz, { id: codeExists.quizId }, { populate: true });
    if (quiz.maxPlayers && quiz.maxPlayers - quiz.players.length === 0) {
      await em.removeAndFlush(codeExists);
      throw new UnprocessableEntityException(`Max players limit = ${quiz.maxPlayers} reached. Unable to register`);
    }
    const problems = await em.find(Participant, {
      $or: [
        {
          nick: data.nick
        },
        {
          $and: [
            {
              quiz
            },
            {
              userId
            }
          ]
        }
      ]
    });
    if (problems.length > 0) {
      throw new UnprocessableEntityException(`Find existing participant with same credentials`);
    }
    const participant = em.create(Participant, { nick: data.nick, rating: 0, userId, quiz });
    quiz.players.add(participant);
    if (quiz.players.length === quiz.maxPlayers) {
      quiz.assign({ isActive: false });
      await em.persistAndFlush(quiz);
    }
    await em.persistAndFlush([participant, quiz]);
    return { id: participant.id, quizId: quiz.id };
  }

  async updateParticipant(params: Participant): Promise<any> {}

  async removeParticipant(id: string): Promise<void> {
    const em = this.em.fork();
    const participant = await em.findOneOrFail(Participant, id);
    const quiz = await em.findOneOrFail(Quiz, participant.quiz.id);
    if (!quiz.isActive) {
      throw new UnprocessableEntityException(`Cannot delete participant from finished or processing quiz`);
    }
    await em.removeAndFlush(participant);
  }
}
