import { AuthTipoEnum } from 'src/domain/user/enums';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TipoAuthEnum } from '../enums';

@Entity('refresh-token')
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  token: string;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  authCredencial: string;

  @Column({
    type: 'enum',
    enum: AuthTipoEnum,
    nullable: true,
  })
  authTipo: AuthTipoEnum;

  @Column({ type: 'boolean', default: false })
  revoked: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  expiresAt: Date;

  @Column({ type: 'varchar', nullable: true })
  createdByIp: String;

  @Column({ type: 'varchar', nullable: true })
  revokedByIp: String;

  @Column({ type: 'varchar', nullable: true })
  replacedByToken: String;

  @Column({ type: 'varchar', nullable: true })
  revokedAccessToken: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  constructor(todo: Partial<RefreshTokenEntity>) {
    Object.assign(this, todo);
  }
}
