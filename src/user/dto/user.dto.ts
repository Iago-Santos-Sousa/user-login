import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  refresh_token?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
