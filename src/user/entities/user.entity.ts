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

  @Column("varchar", { nullable: true, default: "" })
  refresh_token?: string;

  @Column("varchar", {
    nullable: true,
    default: null,
    unique: true,
    length: 255,
  })
  reset_token?: string;

  @Column({ nullable: true, default: null, type: "bigint", unsigned: true })
  reset_token_expiry?: number;

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
