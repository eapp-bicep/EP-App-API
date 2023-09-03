import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'src/global/prisma';
import { CommonMessageResponse, ResponseWithData } from 'src/types';
import { Address } from '@prisma/client';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async create(
    createAddressDto: CreateAddressDto,
  ): Promise<CommonMessageResponse> {
    await this.prisma.address.create({ data: createAddressDto });
    return {
      message: `Address ${createAddressDto.addressLine1} added to the system.`,
    };
  }

  async findAll(): Promise<ResponseWithData<Address[]>> {
    const addresses = await this.prisma.address.findMany();
    return {
      message: `${addresses.length} Addresses fetched.`,
      data: addresses,
    };
  }

  async findOne(id: string): Promise<ResponseWithData<Address>> {
    const address = await this.prisma.address.findUniqueOrThrow({
      where: { id },
    });
    return {
      message: `${address?.addressLine1} Address fetched.`,
      data: address,
    };
  }

  async findByPinCode(pinCode: string): Promise<ResponseWithData<Address[]>> {
    const addresses = await this.prisma.address.findMany({
      where: { pinCode },
    });
    return {
      message: `${addresses?.length} Addresses fetched.`,
      data: addresses,
    };
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<CommonMessageResponse> {
    await this.prisma.address.update({
      where: { id },
      data: updateAddressDto,
    });
    return {
      message: `Address ${updateAddressDto.addressLine1} updated in the system.`,
    };
  }

  async remove(id: string): Promise<CommonMessageResponse> {
    await this.prisma.address.delete({ where: { id } });
    return { message: 'Removed the address from the system.' };
  }
}
