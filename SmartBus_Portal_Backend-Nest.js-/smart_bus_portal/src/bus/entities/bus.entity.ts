import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { Driver } from '../../driver/entities/driver.entity'; // correct import

@Entity()
export class Bus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  busNumber: string;

  @Column()
  route: string;

  @Column()
  capacity: number;

  @OneToMany(() => Driver, driver => driver.bus, { nullable: true })
  drivers: Driver[];
  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
