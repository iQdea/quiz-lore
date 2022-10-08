import { Inject, Injectable } from '@nestjs/common';
import { RecipeListFunction } from 'supertokens-node/lib/build/types';
import { AuthModuleConfig, ConfigInjectionToken } from '../config-supertokens.interface';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { CommonService } from '../utils/common.service';

@Injectable()
export class EmailPasswordLoginService {
  constructor(
    @Inject(ConfigInjectionToken) private config: AuthModuleConfig,
    private readonly commonService: CommonService
  ) {}

  init(): RecipeListFunction {
    const commonService = this.commonService;
    return EmailPassword.init({
      override: {
        functions: (originalImplementation) => ({
          ...originalImplementation,
          async signIn(input) {
            if (originalImplementation.signIn === undefined) {
              throw new Error('Should never come here');
            }

            const output = await originalImplementation.signIn(input);
            await commonService.createUserMeta(output);

            input.userContext.userRecipeId = 'email_password';

            return output;
          },
          async signUp(input) {
            if (originalImplementation.signUp === undefined) {
              throw new Error('Should never come here');
            }

            const output = await originalImplementation.signUp(input);
            await commonService.createUserMeta(output);

            input.userContext.userRecipeId = 'email_password';

            return output;
          }
        })
      }
    });
  }
}
