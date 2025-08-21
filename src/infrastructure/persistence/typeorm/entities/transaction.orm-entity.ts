// src/infrastructure/persistence/typeorm/entities/transaction.orm-entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AccountOrmEntity } from './account.orm-entity';

@Entity('transactions')
export class TransactionOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fromAccountId: number;

  @ManyToOne(() => AccountOrmEntity, { nullable: true })
  @JoinColumn({ name: 'fromAccountId' })
  fromAccount: AccountOrmEntity;

  @Column({ nullable: true })
  toAccountId: number;

  @ManyToOne(() => AccountOrmEntity, { nullable: true })
  @JoinColumn({ name: 'toAccountId' })
  toAccount: AccountOrmEntity;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column()
  type: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 