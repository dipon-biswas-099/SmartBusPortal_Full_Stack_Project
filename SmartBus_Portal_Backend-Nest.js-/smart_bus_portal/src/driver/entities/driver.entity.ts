import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert, OneToOne, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Bus } from '../../bus/entities/bus.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class Driver {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false }) // Don't select password by default
    password: string;

    @Column()
    nid: string;

    @Column({ nullable: true })
    nidImage: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Bus, bus => bus.drivers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'busId' })
    bus: Bus;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}