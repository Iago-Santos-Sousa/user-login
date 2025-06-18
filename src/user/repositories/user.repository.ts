import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { User } from "../entities/user.entity";
import { UpdateUserDto } from "../dto/update-user.dto";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find({
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
      withDeleted: true, // Includes soft-deleted records
    });
  }

  async findOneById(user_id: number): Promise<User | null> {
    return this.repository.findOne({
      where: { user_id },
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
  }

  async findByIdWithPassword(user_id: number): Promise<User | null> {
    return this.repository.findOne({
      where: { user_id },
      withDeleted: true,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
      withDeleted: true,
    });
  }

  async update(
    user_id: number,
    updateUserDto: UpdateUserDto | Partial<User>,
  ): Promise<User> {
    const user = await this.findByIdWithPassword(user_id);
    if (!user) {
      throw new Error(`User with ID ${user_id} not found`);
    }

    const mergedUser = this.repository.merge(user, updateUserDto);
    return this.repository.save(mergedUser);
  }

  async remove(user_id: number): Promise<void> {
    await this.repository.delete(user_id);
  }

  createQueryBuilder(alias: string = "user"): SelectQueryBuilder<User> {
    return this.repository.createQueryBuilder(alias);
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    await this.repository.update(userId, {
      refresh_token: refreshToken,
    });
  }
}
