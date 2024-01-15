import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SigninDto, SignupDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomBytes, scrypt as _scrypt, sign, Hash, createHash } from 'crypto';
import { promisify } from 'util';
import { UserType } from '@prisma/client';
import * as jwt from "jsonwebtoken";
const scrypt=promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor (private readonly prismaService:PrismaService){}
  async signup({email,password,name,phone}:SignupDto,userType:UserType){
    console.log(email)
    const user=await this.prismaService.user.findFirst({where:{email:email}})

    if(user) throw new NotFoundException("User Already exist");
    

    //Hash the password
    //Generate the salt 
    const salt=randomBytes(8).toString('hex');
    //Hash the password and salt and join the result  
    const hash=(await scrypt(password,salt,32)) as Buffer;
    const result=salt+"."+hash.toString('hex');
    
    const newUser=await this.prismaService.user.create({
      data:{
        name,
        phone,
        email,
        password:result,
        userType:userType,
      }
    })

    const token=await jwt.sign({
      name,
      id:newUser.id
    },process.env.JWT_TOKEN,{
      expiresIn:360000
    });
    return token
  }

  async signin({email,password}:SigninDto){
    const user=await this.prismaService.user.findFirst({where:{email:email}})
    if(!user)throw new NotFoundException("User Not found");

    const [salt,storedHash]=user[0].password.split('.');
    const hash=(await scrypt(password,salt,32)) as Buffer;
    if(storedHash!==hash.toString('hex'))throw new BadRequestException("Password or email do not match")

    const token=await jwt.sign({
      name:user[0].name,
      id:user[0].id
    },process.env.JWT_TOKEN,{
      expiresIn:360000
    });

    return token;
  }

  generateProductKey(email:string,userType:UserType){
    const string=`${email}-${userType}-${process.env.PRODUCT_KEY}`;
    const hash=createHash('sha256');
    hash.update(string);
    // console.log(hash.digest('hex'));
    return hash.digest('hex');
  }

}
