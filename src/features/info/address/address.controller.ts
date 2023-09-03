import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Public } from 'src/shared/decorators';

@Controller('info/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':unique')
  @Public()
  findOne(
    @Param('unique') unique: string,
    @Query('byPinCode', ParseBoolPipe) byPinCode: boolean,
  ) {
    if (byPinCode) {
      return this.addressService.findByPinCode(unique);
    }
    return this.addressService.findOne(unique);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
