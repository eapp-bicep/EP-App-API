import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpServer,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

export type ErrorCodesStatusMapping = {
  [key: string]: number;
};

@Catch(Prisma?.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  private errorCodesStatusMapping: ErrorCodesStatusMapping = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  };
  constructor(
    applicationRef?: HttpServer,
    errorCodesStatusMapping?: ErrorCodesStatusMapping,
  ) {
    super(applicationRef);

    if (errorCodesStatusMapping) {
      this.errorCodesStatusMapping = Object.assign(
        this.errorCodesStatusMapping,
        errorCodesStatusMapping,
      );
    }
  }
  catch(
    exception: Prisma.PrismaClientKnownRequestError | any,
    host: ArgumentsHost,
  ) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.catchClientKnownRequestError(exception, host);
    }
  }

  private catchClientKnownRequestError(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const statusCode = this.errorCodesStatusMapping[exception.code];
    let message = `[${exception.code}]: ${this.exceptionShortMessage(
      exception.message,
    )}`;

    if (exception.code === 'P2002') {
      if (
        exception.meta !== null &&
        (exception.meta!.target as []).some(
          (e) => e === 'username' || e === 'email',
        )
      ) {
        message = 'Account already exists';
      } else {
        message =
          'Duplicates not allowed for ' +
          (exception.meta?.target ?? ([] as any)).join(', ');
      }
    }

    if (!Object.keys(this.errorCodesStatusMapping).includes(exception.code)) {
      return super.catch(exception, host);
    }

    super.catch(new HttpException({ statusCode, message }, statusCode), host);
  }

  private exceptionShortMessage(message: string): string {
    const shortMessage = message.substring(message.indexOf('→'));

    return shortMessage
      .substring(shortMessage.indexOf('\n'))
      .replace(/\n/g, '')
      .trim();
  }
}
