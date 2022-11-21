import { Injectable } from '@nestjs/common';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import { merge } from '../common/utils/merge-objects';
import { EntityManager } from '@mikro-orm/postgresql';
import { Participant } from '../entities/participant.entity';
import { UserDtoResponse, UserRatingsDtoResponse } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}
  async showUser(id: string): Promise<UserDtoResponse> {
    const { metadata } = await UserMetadata.getUserMetadata(id);
    return JSON.parse(JSON.stringify(metadata));
  }
  async showUserRating(id: string): Promise<UserRatingsDtoResponse> {
    const em = this.em.fork();
    const profiles = await em.find(Participant, { userId: id });
    const ratings = async () => {
      const ratings = profiles.map(async (x) =>
        Object.assign(
          {},
          {
            nick: x.nick,
            rating: x.rating,
            quiz: {
              id: (await x.quiz.load()).id,
              name: (await x.quiz.load()).displayName,
              descr: (await x.quiz.load()).description ?? ''
            }
          }
        )
      );
      return Promise.all(ratings);
    };
    const sum = (await ratings()).reduce((accumulator, currentValue) => accumulator + currentValue.rating, 0);
    return {
      ratings: await ratings(),
      summary: sum
    };
  }
  async updateUser(data: any, id: string): Promise<UserDtoResponse> {
    const { metadata } = await UserMetadata.getUserMetadata(id);
    const user = await merge(metadata, data);
    const { metadata: userResultData } = await UserMetadata.updateUserMetadata(id, user);
    return JSON.parse(JSON.stringify(userResultData));
  }
}
