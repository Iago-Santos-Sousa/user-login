import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Transform } from "class-transformer";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3)
  @Transform(({ value }: { value: string }) => value?.trim()) // Remove espaços em branco
  name: string;

  //Para validadores mais complexos como IsEmail, você passa primeiro as opções do validador (que podem estar vazias {}) e depois as opções gerais como a mensagem.
  @IsNotEmpty({ message: "O email não pode estar vazio" })
  @IsEmail({}, { message: "O email informado não é válido" })
  @Transform(({ value }: { value: string }) => value?.trim())
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6)
  @Transform(({ value }: { value: string }) => value?.trim())
  password: string;

  @IsNotEmpty({ message: "O papel/função não pode estar vazio" })
  @IsString({ message: "O papel/função deve ser uma string" })
  @Length(4, 20, { message: "O papel/função deve ter entre 4 e 20 caracteres" })
  @Transform(({ value }: { value: string }) => value?.trim())
  role: string;

  @IsString()
  @IsOptional()
  @Length(6)
  @Transform(({ value }: { value: string }) => value?.trim())
  refresh_token?: string;
}
