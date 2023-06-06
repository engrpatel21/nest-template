// jwt.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { LocalAuthGurad } from '../gaurds/local-auth.guard';

export function Auth() {
  return applyDecorators(UseGuards(LocalAuthGurad));
}
