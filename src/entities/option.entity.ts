import { Entity, IdentifiedReference, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Question } from './question.entity';

@Entity({
  schema: 'quiz',
  tableName: 'option'
})
export class Option extends BaseEntity<Option> {
  @Property({
    type: 'varchar'
  })
  text!: string;

  @Property({
    type: 'boolean'
  })
  isAnswer!: boolean;

  @ManyToOne({
    entity: () => Question,
    wrappedReference: true,
    nullable: false
  })
  question!: IdentifiedReference<Question>;
}
