import { Body, Controller, Get, Param, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProductKeyDto, SigninDto, SignupDto } from './dto/auth.dto';
import { UserType } from '@prisma/client';
import { User } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {

  constructor (private readonly authService:AuthService){}

  @Post('/signup/:userType')
  signup(@Body() body:SignupDto,@Param('userType') userType:UserType){
    if(userType!==UserType.BUYER){
      if(!body.productKey)throw new UnauthorizedException("User not authorised");

      if(body.productKey!==(this.authService.generateProductKey(body.email,userType)))
        throw new UnauthorizedException();

    }
    return this.authService.signup(body,userType);
  }

  @Post('/signin')
  signinp(@Body() body:SigninDto){
    return this.authService.signin(body);
  }

  @Post("/key")
  generateProductKey(@Body() body:GenerateProductKeyDto){
    return this.authService.generateProductKey(body.email,body.userType);
  }

  @Get()
  whoAmI(@User() user) {
    return user;
  }
}
