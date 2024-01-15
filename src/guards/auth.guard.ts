import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import * as jwt from "jsonwebtoken";
import { PrismaService } from "src/prisma/prisma.service";

interface jwtPayload{
  name: string;
  id: number;
  iat: number;
  exp: number;
}

export class AuthGuard implements CanActivate{
  constructor(private readonly reflector: Reflector,private readonly prismaService:PrismaService) { }

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass()
    ])

    if (roles?.length) {
      const req = context.switchToHttp().getRequest();
      const token = req?.headers?.authorization;
      try {
        const user = await jwt.verify(token, process.env.JWT_TOKEN) as jwtPayload;
        const findUser = await this.prismaService.user.findUnique({ where: { id: user.id } })
        if (!findUser) return false;

        if (roles.includes(findUser.userType)) return true;
        return false;
      } catch (err) {
        return false;
      }
    }
  }
}