import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int, {nullable: true})
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({type: 'date'})
  createdAt = new Date();

  @Field(() => String)
  @Property({type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  
  @Field(() => String)
  @Property({type: 'text', unique: true })
  username!: string;

  @Field(() => String)
  @Property({type: 'text', unique: false, nullable: true })
  email!: string;

  @Field(() => String)
  @Property({type: 'text'})
  password!: string;

}