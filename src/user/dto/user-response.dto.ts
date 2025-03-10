import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({ example: "User created successfully" })
  message: string;

  @ApiProperty({
    example: {
      user_id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "user",
    },
  })
  user: {
    user_id: number;
    name: string;
    email: string;
    role: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
  };
}
