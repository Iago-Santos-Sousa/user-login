import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class SigInDto {
  //Para validadores mais complexos como IsEmail, você passa primeiro as opções do validador (que podem estar vazias {}) e depois as opções gerais como a mensagem.
  @ApiProperty({ example: "jhondoe@gmail.com" })
  @IsNotEmpty({ message: "O email não pode estar vazio" })
  @IsEmail({}, { message: "O email informado não é válido" })
  @Transform(({ value }: { value: string }) => value?.trim())
  email: string;

  @ApiProperty({ example: "123456" })
  @IsNotEmpty()
  @IsString()
  @Length(6)
  @Transform(({ value }: { value: string }) => value?.trim())
  password: string;
}
