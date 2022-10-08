import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './app.config';
import MkORMConfig from './mikro-orm.config';
import { UserModule } from './user/user.module';
import { AuthSupertokensModule } from './auth/auth-supertokens.module';
import { QuizModule } from './quiz/quiz.module';
import { ParticipantModule } from './participant/participant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config]
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return {
          ...MkORMConfig
        };
      }
    }),
    UserModule,
    QuizModule,
    ParticipantModule,
    AuthSupertokensModule.forRoot(config().supertokens)
  ],
  providers: []
})
export class AppModule {}
