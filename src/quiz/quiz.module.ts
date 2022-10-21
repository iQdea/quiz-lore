import { Global, Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from '../controllers/quiz/quiz.controller';
import { OptionModule } from './options/option.module';
import { QuestionModule } from './questions/question.module';

@Global()
@Module({
  providers: [QuizService],
  imports: [OptionModule, QuestionModule],
  controllers: [QuizController],
  exports: [QuizService]
})
export class QuizModule {}
