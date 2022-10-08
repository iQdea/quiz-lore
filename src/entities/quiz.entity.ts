import { Collection, Entity, OneToMany, PrimaryKey } from '@mikro-orm/core';
import { Participant } from './participant.entity';

@Entity({
  schema: 'quiz_lore_quiz',
  tableName: 'quiz'
})
export class Quiz {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @OneToMany({
    entity: () => Participant,
    mappedBy: (t) => t.ref
  })
  players = new Collection<Participant>(this);
}
