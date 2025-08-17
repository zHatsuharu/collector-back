import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id!: string;

    @ManyToOne(() => User, (user) => user.cards)
    user!: User;

    @Column()
    code!: string;

    @Column()
    type!: string;

    @Column({ default: 1 })
    quantity!: number;
}
