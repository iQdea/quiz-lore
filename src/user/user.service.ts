import { Injectable } from '@nestjs/common';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import { merge } from '../common/utils/merge-objects';

@Injectable()
export class UserService {
  async showUser(id: string): Promise<any> {
    const { metadata } = await UserMetadata.getUserMetadata(id);
    const user = JSON.parse(JSON.stringify(metadata));
    return {
      data: {
        user
      }
    };
  }
  async updateUser(data: any, id: string): Promise<any> {
    const { metadata } = await UserMetadata.getUserMetadata(id);
    const user = await merge(metadata, data);
    const { metadata: userResultData } = await UserMetadata.updateUserMetadata(id, user);
    const userData = JSON.parse(JSON.stringify(userResultData));
    return {
      data: { user: userData }
    };
  }
}
