import { Global, Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from '../controllers/quiz.controller';

@Global()
@Module({
  providers: [QuizService],
  imports: [],
  controllers: [QuizController],
  exports: [QuizService]
})
export class QuizModule {}
