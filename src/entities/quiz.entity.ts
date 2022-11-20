import { Collection, Entity, OneToMany, Property, Unique } from '@mikro-orm/core';
import { Participant } from './participant.entity';
import { BaseEntity } from './base.entity';
import { Question } from './question.entity';

@Entity({
  schema: 'quiz',
  tableName: 'quiz'
})
export class Quiz extends BaseEntity<Quiz, 'isActive'> {
  @Property()
  @Unique()
  displayName!: string;

  @Property({ type: 'uuid' })
  createdById!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({
    type: 'boolean',
    default: true
  })
  isActive: boolean = true;

  @Property({ nullable: true })
  maxPlayers?: number;

  @OneToMany({
    entity: () => Participant,
    mappedBy: (t) => t.quiz
  })
  players = new Collection<Participant>(this);

  @OneToMany({
    entity: () => Question,
    mappedBy: (t) => t.quiz
  })
  questions = new Collection<Question>(this);
}
