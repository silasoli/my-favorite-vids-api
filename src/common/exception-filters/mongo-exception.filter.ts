import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const errorInfo: MongoException = MongoErrors[exception.code] || {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      messageByField: 'Internal server error',
    };

    const field = this.extractFieldFromErrorMessage(exception.errmsg);
    const message = errorInfo.messageByField(field)

    response.status(errorInfo.status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }

  private extractFieldFromErrorMessage(errmsg: string): string | undefined {
    const match = errmsg.match(/\{([^}]+)\}/);
    if (match && match.length > 1) {
      const fieldData = match[1].split(':')[0].trim();
      return fieldData;
    }
    return undefined;
  }
}

export type MongoException = {
  status: HttpStatus;
  messageByField: string | any;
};

export const MongoErrors = {
  11000: {
    status: HttpStatus.CONFLICT,
    messageByField: (field: string): string => {
      switch (field) {
        case 'username':
          return 'O nome de usuário já está em uso.';
        case 'email':
          return 'O endereço de e-mail já está em uso.';
        default:
          return 'Erro de chave duplicada.';
      }
    },
  },
};
