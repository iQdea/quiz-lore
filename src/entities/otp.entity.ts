import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity({
  schema: 'quiz',
  tableName: 'otp'
})
export class Otp extends BaseEntity<Otp> {
  @Property({
    length: 6
  })
  code!: string;

  @Property({
    type: 'uuid'
  })
  ownerId!: string;

  @Property({
    type: 'uuid'
  })
  quizId!: string;

  @Property({
    type: 'array',
    default: []
  })
  privateList!: string[];
}
