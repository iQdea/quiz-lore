import { Global, Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from '../../controllers/quiz/options.controller';

@Global()
@Module({
  providers: [OptionService],
  imports: [],
  controllers: [OptionController],
  exports: [OptionService]
})
export class OptionModule {}
