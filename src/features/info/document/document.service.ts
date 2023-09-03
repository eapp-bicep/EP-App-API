import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CommonMessageResponse, ResponseWithData } from 'src/types';
import { PrismaService } from 'src/global/prisma';
import { Document } from '@prisma/client';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  async create(
    createDocumentDto: CreateDocumentDto,
  ): Promise<CommonMessageResponse> {
    await this.prisma.document.create({ data: createDocumentDto });
    return {
      message: `Document ${createDocumentDto.imgName} added to the system.`,
    };
  }

  async findAll(): Promise<ResponseWithData<Document[]>> {
    const documents = await this.prisma.document.findMany({});
    return {
      message: `${documents.length} Documents fetched.`,
      data: documents,
    };
  }

  async findOne(id: string): Promise<ResponseWithData<Document>> {
    const document = await this.prisma.document.findUniqueOrThrow({
      where: { id },
    });
    return {
      message: `${document?.imgName} Document fetched.`,
      data: document,
    };
  }

  async update(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<CommonMessageResponse> {
    await this.prisma.document.update({
      where: { id },
      data: updateDocumentDto,
    });
    return {
      message: `Document ${updateDocumentDto.imgName} updated in the system.`,
    };
  }

  async remove(id: string): Promise<CommonMessageResponse> {
    await this.prisma.document.delete({ where: { id } });
    return { message: 'Removed the document from the system.' };
  }
}
