import {
  IsNotEmpty,
  IsOptional,
  IsPostalCode,
  IsString,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @IsString()
  @IsOptional()
  addressLine2: string;

  @IsString()
  @IsPostalCode('IN')
  pinCode: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}
