import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { RequiredEntityData } from '@mikro-orm/core';
import { Quiz } from '../entities/quiz.entity';

@Injectable()
export class QuizService {
  constructor(private readonly em: EntityManager) {}
  async createQuiz(params: RequiredEntityData<Quiz>): Promise<any> {}
  async updateQuiz(params: Quiz): Promise<any> {}
  async getHistory(): Promise<any> {}
  async getRatings(id: string): Promise<any> {}
  async generateLink(id: string): Promise<any> {}
}
