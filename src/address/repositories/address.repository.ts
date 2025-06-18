import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Address } from "../entities/address.entity";
import { CreateAddressDto } from "../dto/create-address.dto";
import { UpdateAddressDto } from "../dto/update-address.dto";

@Injectable()
export class AddressRepository {
  constructor(
    @InjectRepository(Address)
    private readonly repository: Repository<Address>,
  ) {}

  async create(addressData: CreateAddressDto): Promise<Address> {
    const address = this.repository.create(addressData);
    return this.repository.save(address);
  }

  async findAll(): Promise<Address[]> {
    return this.repository.find({
      relations: ["users"],
    });
  }

  async findById(id: number): Promise<Address | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["users"],
    });
  }

  async findByCity(city: string): Promise<Address[]> {
    return this.repository.find({
      where: { city },
      relations: ["users"],
    });
  }

  async findByUf(uf: string): Promise<Address[]> {
    return this.repository.find({
      where: { uf },
      relations: ["users"],
    });
  }

  async findByZipCode(zipCode: string): Promise<Address[]> {
    return this.repository.find({
      where: { zipCode },
      relations: ["users"],
    });
  }

  async update(id: number, updateData: UpdateAddressDto): Promise<Address> {
    const address = await this.findById(id);
    if (!address) {
      throw new Error(`Address with ID ${id} not found`);
    }

    const mergedAddress = this.repository.merge(address, updateData);
    return this.repository.save(mergedAddress);
  }

  async remove(id: number): Promise<void> {
    const address = await this.findById(id);
    if (!address) {
      throw new Error(`Address with ID ${id} not found`);
    }

    await this.repository.remove(address);
  }

  async countByCity(city: string): Promise<number> {
    return this.repository.count({
      where: { city },
    });
  }

  async countByUf(uf: string): Promise<number> {
    return this.repository.count({
      where: { uf },
    });
  }

  createQueryBuilder(alias: string = "address"): SelectQueryBuilder<Address> {
    return this.repository.createQueryBuilder(alias);
  }

  async findWithPagination(
    skip: number,
    take: number,
  ): Promise<[Address[], number]> {
    return this.repository.findAndCount({
      relations: ["users"],
      skip,
      take,
      order: {
        id: "ASC",
      },
    });
  }

  async findByNeighborhood(neighborhood: string): Promise<Address[]> {
    return this.repository.find({
      where: { neighborhood },
      relations: ["users"],
    });
  }

  async findByStreet(street: string): Promise<Address[]> {
    return this.repository.find({
      where: { street },
      relations: ["users"],
    });
  }
}
