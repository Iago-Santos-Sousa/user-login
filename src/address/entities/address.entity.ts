import {
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from "typeorm";
import { User } from "src/user/entities/user.entity";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 10 })
  zipCode: string;

  @Column("varchar", { length: 100 })
  street: string;

  @Column("varchar", { length: 50 })
  number: string;

  @Column("varchar", { length: 100 })
  neighborhood: string;

  @Column("varchar", { length: 255 })
  complement: string;

  @Column("varchar", { length: 100 })
  city: string;

  @Column("char", { length: 2 })
  uf: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updated_at: Date;

  @OneToMany(() => User, (user) => user.address)
  users: User[];
}
