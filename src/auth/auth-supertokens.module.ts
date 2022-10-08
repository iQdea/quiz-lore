import { DynamicModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModuleConfig, ConfigInjectionToken } from './config-supertokens.interface';
import { AuthSupertokensService } from './auth-supertokens.service';
import { AuthSupertokensMiddleware } from './auth-supertokens.middleware';
import { PasswordlessService } from './recipes/passwordless.service';
import { EmailPasswordLoginService } from './recipes/email-password-login.service';
import { CommonService } from './utils/common.service';
import { UserModule } from '../user/user.module';
import { SessionService } from './recipes/session.service';

@Module({})
export class AuthSupertokensModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthSupertokensMiddleware).forRoutes('*');
  }

  static forRoot(config: AuthModuleConfig): DynamicModule {
    return {
      providers: [
        {
          provide: ConfigInjectionToken,
          useValue: config
        },
        CommonService,
        AuthSupertokensService,
        EmailPasswordLoginService,
        PasswordlessService,
        SessionService
      ],
      exports: [],
      imports: [UserModule],
      module: AuthSupertokensModule
    };
  }
}
