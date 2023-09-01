import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
  IsUrl,
  Length,
} from 'class-validator';

export class SaveBusinessInfoDto {
  @IsString()
  @IsNotEmpty()
  @Length(4)
  organizationName: string;

  @IsString()
  @IsNotEmpty()
  officeAddress: string;

  @IsPhoneNumber('IN')
  @IsNotEmpty()
  officeContact: string;

  @IsUrl()
  @IsNotEmpty()
  websiteUrl: string;

  @IsUUID()
  @IsNotEmpty()
  domainOfWork: string;
}
