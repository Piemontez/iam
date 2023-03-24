import { HttpException } from '@nestjs/common';

export type FormExceptionError = { kind: string; error: string };

export class FormException extends HttpException {
  constructor(errors: Array<FormExceptionError>, message = null, status = 400) {
    super(
      //
      {
        message: message || errors.map((e) => e.error).join('\n'),
        errors,
      },
      status,
    );
  }
}
