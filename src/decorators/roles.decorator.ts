import { SetMetadata } from "@nestjs/common";
import { UserType } from "@prisma/client";

export const Roles = (...args:UserType[]) => SetMetadata('roles', args)