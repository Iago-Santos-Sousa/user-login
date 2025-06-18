/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponseDto, UsersResponseDto } from "./dto/user-response.dto";
import { PageDto, PageOptionsDto, PageMetaDto } from "src/common/dtos";
import { UserDto } from "./dto/user.dto";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { UserRepository } from "./repositories/user.repository";
const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const existUser = await this.userRepository.findByEmail(
        createUserDto.email,
      );
      if (existUser) {
        throw new HttpException("Email already exists", HttpStatus.CONFLICT);
      }

      const salt = randomBytes(8).toString("hex"); // unique salt per registration
      const hashPassword = (await scrypt(
        createUserDto.password,
        salt,
        32,
      )) as Buffer;

      // Join salt with encrypted password
      const saltAndHashPassword = `${salt}.${hashPassword.toString("hex")}`;
      const createdUser = await this.userRepository.create({
        ...createUserDto,
        password: saltAndHashPassword,
      });

      return new UserResponseDto("User created successfully", createdUser);
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
  }
  async findAll(): Promise<UsersResponseDto> {
    const users = await this.userRepository.findAll();
    if (users?.length === 0) throw new NotFoundException("No users found");
    return new UsersResponseDto("Users found", users);
  }

  async findOne(user_id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneById(user_id);
    if (!user) throw new NotFoundException(`User with ID ${user_id} not found`);
    return {
      message: "User found",
      user,
    };
  }

  async findById(user_id: number): Promise<User | null> {
    return this.userRepository.findByIdWithPassword(user_id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
  async update(
    user_id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findByIdWithPassword(user_id);
    if (!user) {
      throw new NotFoundException(`User with id ${user_id} not found`);
    }
    const updatedUser = await this.userRepository.update(
      user_id,
      updateUserDto,
    );
    const { password, refresh_token, ...safeUser } = updatedUser;
    return {
      message: `User with ID ${user_id} updated`,
      user: safeUser,
    };
  }

  async remove(user_id: number): Promise<Pick<UserResponseDto, "message">> {
    const user = await this.userRepository.findByIdWithPassword(user_id);
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    await this.userRepository.remove(user_id);
    return {
      message: `User with ID ${user_id} was successfully removed`,
    };
  }
  async findUsersPaginated(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder("user");
    console.log(
      pageOptionsDto.page,
      pageOptionsDto.skip,
      pageOptionsDto.order,
      pageOptionsDto.take,
    );

    queryBuilder.withDeleted();
    queryBuilder
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .orderBy("user.user_id", pageOptionsDto.order);

    // const [data, itemCount] = await queryBuilder.getManyAndCount();
    const entities = await queryBuilder.getMany();
    const itemCount = await queryBuilder.getCount();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(
      entities.map((user) => new UserDto(user)),
      pageMetaDto,
    );
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    return this.userRepository.updateRefreshToken(userId, refreshToken);
  }

  async logout(user_id: number): Promise<{ message: string }> {
    await this.userRepository.updateRefreshToken(user_id, "");
    return {
      message: "User logged out successfully",
    };
  }
}
