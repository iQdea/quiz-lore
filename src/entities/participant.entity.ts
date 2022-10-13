import { Entity, IdentifiedReference, ManyToOne, Property } from '@mikro-orm/core';
import { Quiz } from './quiz.entity';
import { BaseEntity } from './base.entity';

@Entity({
  schema: 'quiz_lore_participant',
  tableName: 'participant'
})
export class Participant extends BaseEntity<Participant> {
  @Property()
  nick!: string;

  @ManyToOne({
    entity: () => Quiz,
    wrappedReference: true,
    nullable: true
  })
  quiz!: IdentifiedReference<Quiz>;
}
