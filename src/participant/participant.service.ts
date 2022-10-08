import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { RequiredEntityData } from '@mikro-orm/core';
import { Participant } from '../entities/participant.entity';

@Injectable()
export class ParticipantService {
  constructor(private readonly em: EntityManager) {}
  async showParticipant(id: string): Promise<any> {}
  async createParticipant(params: RequiredEntityData<Participant>): Promise<any> {}
  async updateParticipant(params: Participant): Promise<any> {}
  async removeParticipant(id: string): Promise<any> {}
}
