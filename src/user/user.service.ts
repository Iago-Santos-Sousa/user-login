/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import * as bcrypt from "bcrypt";
const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const hashPassword = await bcrypt.hash(
        createUserDto.password,
        saltOrRounds,
      );
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashPassword,
      });
      const createdUser = await this.userRepository.save(user);
      const { password, refresh_token, ...safeUser } = createdUser;
      return {
        message: "User created successfully",
        user: safeUser,
      };
    } catch (error) {
      console.error(error);
      if (
        error?.sqlMessage?.includes(`Duplicate entry '${createUserDto.email}'`)
      ) {
        throw new ConflictException(`Email already exists`);
      }
      throw error;
    }
  }

  async findAll(): Promise<{
    message: string;
    users: Omit<User, "password" | "refresh_token">[];
  }> {
    const users = await this.userRepository.find({
      select: {
        name: true,
        email: true,
        role: true,
        created_at: true,
        user_id: true,
        deleted_at: false,
        updated_at: true,
        password: false,
        refresh_token: false,
      },
      withDeleted: true, // Inclui registros soft-deleted
    });

    if (users?.length === 0) throw new NotFoundException("No users found");
    return {
      message: "Users found",
      users: users,
    };
  }

  async findOne(user_id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { user_id: user_id },
      select: {
        name: true,
        email: true,
        role: true,
        created_at: true,
        user_id: true,
        deleted_at: false,
        updated_at: true,
        password: false,
        refresh_token: false,
      },
      withDeleted: true,
    });

    if (!user) throw new NotFoundException(`User with ID ${user_id} not found`);
    return {
      message: "User found",
      user,
    };
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      withDeleted: true,
    });

    if (!user)
      throw new NotFoundException(`User with Email: ${email} not found`);
    return user;
  }

  async update(
    user_id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { user_id: user_id },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${user_id} not found`);
    }
    const mergeUpdatedUser = this.userRepository.merge(user, updateUserDto);
    const updatedUser = await this.userRepository.save(mergeUpdatedUser);
    const { password, refresh_token, ...safeUser } = updatedUser;
    return {
      message: `User with ID ${user_id} updated`,
      user: safeUser,
    };
  }

  async remove(user_id: number): Promise<Pick<UserResponseDto, "message">> {
    const user = await this.userRepository.findOne({
      where: { user_id: user_id },
      withDeleted: true,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    await this.userRepository.delete(user_id);
    return {
      message: `User with ID ${user_id} was successfully removed`,
    };
  }
}
