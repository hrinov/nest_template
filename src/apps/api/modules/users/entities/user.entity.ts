import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EUserRoles } from '../types';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: EUserRoles, default: EUserRoles.USER })
  role: EUserRoles;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updated_at: Date;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created_at: Date;
}
