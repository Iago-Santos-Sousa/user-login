export class SigInResponseDto {
  acess_token: string;
  refresh_token?: string | null;
  payload: {
    sub: number;
    username: string;
    email: string;
    roles: string[];
  };
}
