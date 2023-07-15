import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthTipoEnum, RoleEnum } from '../enums';
import { PostsEntity } from 'src/domain/posts/entities';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 255, type: 'varchar' })
  nome: string;

  @Column({ nullable: true, length: 255, type: 'varchar' })
  sobrenome: string;

  @Column({ nullable: false, type: 'varchar', select: false })
  senha: string;

  @Column({ nullable: true, length: 255, type: 'varchar', unique: true })
  email: string;

  @Column({ nullable: true, length: 255, type: 'varchar', unique: true })
  authCredencial: string;

  @Column({ nullable: true, length: 255, type: 'varchar' })
  iconUrl: string;

  @Column({ nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  dataCadastro: Date;

  @Column({ nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  dataAtualizacao: Date;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    nullable: true,
    default: RoleEnum.USER,
  })
  role: RoleEnum;

  @Column({
    type: 'enum',
    enum: AuthTipoEnum,
    nullable: true,
    default: AuthTipoEnum.LOCAL,
  })
  authTipo: AuthTipoEnum;

  @OneToMany(() => PostsEntity, (posts) => posts.userId)
  posts: PostsEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashSenha(): Promise<void> {
    this.senha = await bcrypt.hash(this.senha, 10);
  }

  constructor(todo: Partial<UserEntity>) {
    Object.assign(this, todo);
  }
}
