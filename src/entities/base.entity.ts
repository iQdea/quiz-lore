import { BaseEntity as OrmBase, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';

export abstract class BaseEntity<T extends BaseEntity<T, any>, Optional extends keyof T = never> extends OrmBase<
  T,
  'id',
  '_id'
> {
  @PrimaryKey({
    comment: 'Entity identifier in UUID format. Generated automatically on DB level',
    type: 'uuid',
    defaultRaw: 'uuid_generate_v1()'
  })
  id!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({
    onUpdate: () => new Date()
  })
  updatedAt: Date = new Date();

  [OptionalProps]?: 'createdAt' | 'updatedAt' | Optional;
}
