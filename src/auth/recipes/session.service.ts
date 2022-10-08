import { Injectable } from '@nestjs/common';
import { RecipeListFunction } from 'supertokens-node/lib/build/types';
import Session from 'supertokens-node/recipe/session';

@Injectable()
export class SessionService {
  init(): RecipeListFunction {
    return Session.init({
      override: {
        functions: (originalImplementation) => {
          return {
            ...originalImplementation,
            createNewSession: async function (input) {
              input.accessTokenPayload.userRecipeId = input.userContext.userRecipeId;
              return originalImplementation.createNewSession(input);
            }
          };
        }
      }
    });
  }
}
