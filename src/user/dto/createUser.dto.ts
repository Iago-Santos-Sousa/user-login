import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
  MaxLength,
  IsEnum,
} from "class-validator";
import { Transform } from "class-transformer";
import { UserRole } from "src/utils/enums";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @Transform(({ value }: { value: string }) => value?.trim()) // Remove espaços em branco
  name: string;

  //Para validadores mais complexos como IsEmail, você passa primeiro as opções do validador (que podem estar vazias {}) e depois as opções gerais como a mensagem.
  @IsNotEmpty({ message: "O email não pode estar vazio" })
  @IsEmail({}, { message: "O email informado não é válido" })
  @Transform(({ value }: { value: string }) => value?.trim())
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @Transform(({ value }: { value: string }) => value?.trim())
  password: string;

  @IsNotEmpty({ message: "O papel/função não pode estar vazio" })
  @IsString({ message: "O papel/função deve ser uma string" })
  @Length(4, 5, { message: "O papel/função deve ter entre 4 e 5 caracteres" })
  @Transform(({ value }: { value: string }) => value?.trim())
  @IsEnum(UserRole, { message: "O papel deve ser user ou admin" })
  role: UserRole;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @Transform(({ value }: { value: string }) => value?.trim())
  refresh_token?: string;
}
