import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthSupertokensGuard } from '../auth/auth-supertokens.guard';
import { Session } from '../auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { ParticipantService } from '../participant/participant.service';
import { RequiredEntityData } from '@mikro-orm/core';
import { Participant } from '../entities/participant.entity';

@ApiTags('Participant')
@Controller({
  path: 'participant',
  version: '1'
})
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Get()
  @UseGuards(AuthSupertokensGuard)
  async getParticipant(@Session() session: SessionContainer): Promise<any> {
    return await this.participantService.showParticipant(session.getUserId());
  }

  @Post()
  @UseGuards(AuthSupertokensGuard)
  async createParticipant(@Body() data: RequiredEntityData<Participant>): Promise<any> {
    return await this.participantService.createParticipant(data);
  }

  @Patch()
  @UseGuards(AuthSupertokensGuard)
  async updateParticipant(@Body() data: Participant): Promise<any> {
    return await this.participantService.updateParticipant(data);
  }

  @Delete()
  @UseGuards(AuthSupertokensGuard)
  async removeParticipant(@Param('id') participantId: string): Promise<any> {
    return await this.participantService.removeParticipant(participantId);
  }
}
