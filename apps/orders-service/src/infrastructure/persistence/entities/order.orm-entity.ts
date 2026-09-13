import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class OrderOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  trackingNumber: string;

  @Column()
  merchantId: string;

  @Column()
  originAddress: string;

  @Column()
  destinationAddress: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}