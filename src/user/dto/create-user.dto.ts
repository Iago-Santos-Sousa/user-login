import {
  IsEmail,
  IsNotEmpty,
  IsString,
  // Length,
  MinLength,
  MaxLength,
  IsEnum,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { UserRole } from "src/utils/enums";

export class CreateUserDto {
  @ApiProperty({ description: "Username", example: "Jhon Doe" })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @Transform(({ value }: { value: string }) => value?.trim()) // Remove espaços em branco
  name: string;

  //Para validadores mais complexos como IsEmail, você passa primeiro as opções do validador (que podem estar vazias {}) e depois as opções gerais como a mensagem.
  @ApiProperty({ description: "User E-mail", example: "jhondoe@gmail.com" })
  @IsNotEmpty({ message: "O email não pode estar vazio" })
  @IsEmail({}, { message: "O email informado não é válido" })
  @Transform(({ value }: { value: string }) => value?.trim())
  email: string;

  @ApiProperty({ description: "user password", example: "123456" })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @Transform(({ value }: { value: string }) => value?.trim())
  password: string;

  @ApiProperty({
    description: "user permission",
    type: "string",
    example: "user",
    default: "user",
  })
  @IsNotEmpty({ message: "O papel/função não pode estar vazio" })
  @IsEnum(UserRole, { message: "O papel deve ser user ou admin" })
  role: UserRole;

  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // @MinLength(6)
  // @Transform(({ value }: { value: string }) => value?.trim())
  // refresh_token?: string;
}
