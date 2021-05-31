import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String, { description: 'Nome' })
  name: string;

  @Column()
  @Field(() => String, { description: 'E-mail' })
  email: string;
}
