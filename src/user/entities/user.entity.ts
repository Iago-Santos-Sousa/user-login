import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column("varchar", { length: 255 })
  name: string;

  @Column("varchar", { length: 255, unique: true })
  email: string;

  @Column("varchar", { length: 255 })
  password: string;

  @Column("varchar", { length: 20 })
  role: string;

  @Column({ nullable: true, default: "NULL" })
  refresh_token?: string;

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

  @DeleteDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  deleted_at: Date;
}
