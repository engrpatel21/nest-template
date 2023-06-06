import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';


@Injectable()
export class LoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const result = context.switchToHttp().getRequest().isAuthenticated();
    return result
  }
}