import { Global, Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from '../../controllers/quiz/question.controller';

@Global()
@Module({
  providers: [QuestionService],
  imports: [],
  controllers: [QuestionController],
  exports: [QuestionService]
})
export class QuestionModule {}
