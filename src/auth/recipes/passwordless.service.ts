import { Inject, Injectable } from '@nestjs/common';
import { RecipeListFunction } from 'supertokens-node/lib/build/types';
import { AuthModuleConfig, ConfigInjectionToken } from '../config-supertokens.interface';
import Passwordless from 'supertokens-node/recipe/passwordless';
import { CommonService } from '../utils/common.service';

@Injectable()
export class PasswordlessService {
  constructor(
    @Inject(ConfigInjectionToken) private config: AuthModuleConfig,
    private readonly commonService: CommonService
  ) {}

  init(): RecipeListFunction {
    const commonService = this.commonService;
    return Passwordless.init({
      contactMethod: 'PHONE',
      flowType: 'USER_INPUT_CODE',
      override: {
        functions: (originalImplementation) => ({
          ...originalImplementation,
          async consumeCode(input) {
            if (originalImplementation.consumeCode === undefined) {
              throw new Error('Should never come here');
            }

            const output = await originalImplementation.consumeCode(input);
            await commonService.createUserMeta(output);

            input.userContext.userRecipeId = 'password_less';

            return output;
          }
        })
      }
    });
  }
}
