import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export class UserDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @Exclude()
  refresh_token?: string;

  @Exclude()
  password: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @Exclude()
  deleted_at: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
