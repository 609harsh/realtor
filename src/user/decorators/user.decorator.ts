import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const User=createParamDecorator((data,context:ExecutionContext)=>{

  const req=context.switchToHttp().getRequest();
  console.log("Hello");
  
  console.log(req.user);

  
  return req.user;
})