import { Card } from "src/cards/entities/card.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: String, nullable: false })
    username: string;

    @Column({ type: String, nullable: false, unique: true })
    email:string;

    @Column({ type: String, nullable: false })
    password: string;

    @Column({ type: Boolean, nullable: false, default: false })
    entreprise: boolean;

    @OneToMany(() => Card, (card) => card.user, { cascade: true })
    cards: Card[]
}
