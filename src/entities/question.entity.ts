import { Collection, Entity, IdentifiedReference, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Quiz } from './quiz.entity';
import { Option } from './option.entity';

@Entity({
  schema: 'quiz',
  tableName: 'question'
})
export class Question extends BaseEntity<Question> {
  @Property({ type: 'varchar' })
  question!: string;

  @ManyToOne({
    entity: () => Quiz,
    wrappedReference: true,
    nullable: false
  })
  quiz!: IdentifiedReference<Quiz>;

  @OneToMany({
    entity: () => Option,
    mappedBy: (option) => option.question
  })
  options = new Collection<Option>(this);
}
