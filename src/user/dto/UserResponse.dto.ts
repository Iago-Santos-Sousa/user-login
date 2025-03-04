export class UserResponseDto {
  message: string;
  user: {
    user_id: number;
    name: string;
    email: string;
    role: string;
    password?: string;
    refresh_token?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
  };
}
