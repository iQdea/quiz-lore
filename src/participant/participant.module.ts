import { Global, Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { ParticipantController } from '../controllers/participant.controller';

@Global()
@Module({
  providers: [ParticipantService],
  imports: [],
  controllers: [ParticipantController],
  exports: [ParticipantService]
})
export class ParticipantModule {}
