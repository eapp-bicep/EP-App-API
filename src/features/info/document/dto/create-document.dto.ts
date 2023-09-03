import { DocumentType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  imgFullPath: string;

  @IsString()
  @IsNotEmpty()
  imgName: string;

  @IsString()
  @IsNotEmpty()
  imgOriginalName: string;

  @IsUrl()
  @IsNotEmpty()
  imgDownloadUrl: string;

  @IsString()
  @IsNotEmpty()
  bucket: string;

  @IsEnum(DocumentType)
  @IsNotEmpty()
  imgType: DocumentType;
}
