export class SigInResponseDto {
  acess_token: string;
  refresh_token?: string | null;
  payload: {
    user_id: number;
    name: string;
    email: string;
    role: string;
  };
}
