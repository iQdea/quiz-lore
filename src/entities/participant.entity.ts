import { Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Quiz } from './quiz.entity';

@Entity({
  schema: 'quiz_lore_participant',
  tableName: 'participant'
})
export class Participant {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property()
  nick!: string;

  @ManyToOne({
    entity: () => Quiz,
    wrappedReference: true,
    nullable: true
  })
  ref!: IdentifiedReference<Quiz>;
}
