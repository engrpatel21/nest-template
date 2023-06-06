// jwt.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { LoggedInGuard } from '../gaurds/logged-in.guard';

export function LoggedIn() {
  return applyDecorators(UseGuards(LoggedInGuard));
}
