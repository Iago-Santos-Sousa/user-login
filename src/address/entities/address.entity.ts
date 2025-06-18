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
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column("varchar", { name: "zip_code", length: 10 })
  zipCode: string;

  @Column("varchar", { length: 100, name: "street" })
  street: string;

  @Column("varchar", { length: 50, name: "number" })
  number: string;

  @Column("varchar", { length: 100, name: "neighborhood" })
  neighborhood: string;

  @Column("varchar", {
    length: 100,
    name: "complement",
    nullable: true,
    default: null,
  })
  complement: string;

  @Column("varchar", { length: 100, name: "city" })
  city: string;

  @Column("char", { length: 2, name: "uf" })
  uf: string;

  @CreateDateColumn({
    type: "timestamp",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    name: "updated_at",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updated_at: Date;

  @OneToMany(() => User, (user) => user.address)
  users: User[];
}
