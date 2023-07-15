import { UserEntity } from 'src/domain/user/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('posts')
export class PostsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  constructor(todo: Partial<PostsEntity>) {
    Object.assign(this, todo);
  }
}
