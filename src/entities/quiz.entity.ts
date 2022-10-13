import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { Participant } from './participant.entity';
import { BaseEntity } from './base.entity';

@Entity({
  schema: 'quiz_lore_quiz',
  tableName: 'quiz'
})
export class Quiz extends BaseEntity<Quiz> {
  @Property()
  displayName!: string;

  @Property({ type: 'uuid' })
  createdById!: string;

  @Property({ nullable: true })
  description?: string;

  @OneToMany({
    entity: () => Participant,
    mappedBy: (t) => t.quiz
  })
  players = new Collection<Participant>(this);
}
