import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import { AuthModuleConfig, ConfigInjectionToken } from './config-supertokens.interface';
import { EmailPasswordLoginService } from './recipes/email-password-login.service';
import { PasswordlessService } from './recipes/passwordless.service';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import { SessionService } from './recipes/session.service';

@Injectable()
export class AuthSupertokensService {
  constructor(
    @Inject(ConfigInjectionToken) private config: AuthModuleConfig,
    private readonly emailPasswordLoginService: EmailPasswordLoginService,
    private readonly passwordless: PasswordlessService,
    private readonly session: SessionService
  ) {
    supertokens.init({
      appInfo: this.config.appInfo,
      supertokens: {
        connectionURI: this.config.connectionURI,
        apiKey: this.config.apiKey
      },
      recipeList: [
        this.passwordless.init(),
        this.emailPasswordLoginService.init(),
        this.session.init(),
        UserMetadata.init()
      ]
    });
  }
}
