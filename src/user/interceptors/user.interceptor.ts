import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import * as jwt from "jsonwebtoken";


export class UserInterceptor implements NestInterceptor{
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
      const req=context.switchToHttp().getRequest();
      const token=req?.headers?.authorization;
      const user=await jwt.decode(token);

      req.user=user;

    return next.handle();
  }
}