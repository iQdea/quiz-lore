import { Injectable } from '@nestjs/common';
import UserMetadata from 'supertokens-node/recipe/usermetadata';

@Injectable()
export class CommonService {
  public async createUserMeta(output: any): Promise<void> {
    let id = null;
    if (output.status === 'OK') {
      const { metadata } = await UserMetadata.getUserMetadata(output.user.id);
      id = metadata.id;
      if (!id || output.createdNewUser) {
        const userObject = {
          firstName: '',
          lastName: '',
          birthDate: ''
        };
        await UserMetadata.updateUserMetadata(output.user.id, { id: output.user.id, ...userObject });
      }
    }
  }
}
