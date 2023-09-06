import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateIdeaDto, UpdateIdeaDto } from './dto';

import { PrismaService } from 'src/global/prisma';
import { CommonMessageResponse, ResponseWithData } from 'src/types';
import { DocumentType, Idea } from '@prisma/client';
import { CloudinaryService } from 'src/dynamic-modules/cloudinary';

@Injectable()
export class IdeasService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(
    userId: string,
    createIdeaDto: CreateIdeaDto,
    documents: Array<Express.Multer.File>,
  ): Promise<ResponseWithData<Idea>> {
    if (typeof documents === 'undefined' || documents.length <= 0) {
      throw new BadRequestException(
        'There are no documents, please attach related documents.',
      );
    }
    const docsUploaded = this.cloudinary.uploadFiles(documents, `${userId}`);
    const idea = await this.prisma.idea.create({
      data: {
        ...createIdeaDto,
        ideaStage: {
          connect: {
            id: createIdeaDto.ideaStage,
          },
        },
        segment: {
          connect: {
            id: createIdeaDto.segment,
          },
        },
        documents: {
          createMany: {
            data: Array.from(
              (await docsUploaded).map((doc) => ({
                bucket: doc.folder,
                imgDownloadUrl: doc.secure_url,
                imgFullPath: doc.public_id,
                imgName: doc.asset_id,
                imgOriginalName: doc.original_filename,
                imgType: DocumentType.IDEA_PITCH_DECK,
              })),
            ),
          },
        },
      },
    });
    await this.prisma.userOnIdeas.create({
      data: {
        idea: { connect: idea },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return { data: idea, message: 'Uploaded idea.' };
  }

  findAll() {
    return `This action returns all ideas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} idea`;
  }

  update(id: number, updateIdeaDto: UpdateIdeaDto) {
    return `This action updates a #${id} idea`;
  }

  async remove(id: string): Promise<CommonMessageResponse> {
    const idea = await this.prisma.idea.findUniqueOrThrow({
      where: { id },
      include: { documents: { select: { id: true, imgFullPath: true } } },
    });
    const res = await this.cloudinary.deleteFiles(
      idea.documents.map((e) => e.imgFullPath),
    );
    if (res.partial !== false) {
      throw new InternalServerErrorException(
        'Could not delete the idea files. Try again.',
      );
    }
    await this.prisma.idea.delete({ where: { id } });
    return { message: 'Deleted the Idea.' };
  }
}
