import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UnauthorizedException, UseGuards
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeDto, UpdateHomeDto } from './dto/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';


@Controller('home')
export class HomeController {
  constructor (private readonly homeService:HomeService){}
  @Get()
  getHomes(
    @Query('city') city?:string,
    @Query('minPrice') minPrice?:string,
    @Query('maxPrice') maxPrice?:string,
    @Query('propertyType') propertyType?:PropertyType
    ):Promise<HomeDto[]>{
      const price=minPrice || maxPrice ?{
        ...(minPrice && {gte:parseFloat(minPrice)}),
        ...(maxPrice && {lte:parseFloat(maxPrice)}),
      }:undefined

      const filter={
        ...(city && {city}),
        ...(price && {price}),
        ...(propertyType &&{propertyType})
      }
      console.log(city,minPrice,maxPrice,propertyType)
    return this.homeService.getHomes(filter);
    
  }

  @Get(':id')
  getHome(@Param('id',ParseIntPipe) id:number){
    return this.homeService.getHomeById(id);
  }
  @Roles(UserType.REALTOR,UserType.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  createHome(@Body() body:CreateHomeDto,@User() user){
    return this.homeService.createHome(body,user.id);
  }

  @Put(":id")
  updateHome(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateHomeDto, @User() user) {
    const realtor_id = this.homeService.getRealtorHomeById(id);
    if (realtor_id !== user.id) throw new UnauthorizedException();
    return this.homeService.updateHome(body,id);
  }

  @Delete(":id")
  deleteHome(@Param('id', ParseIntPipe) id: number, @User() user) {
    const realtor_id = this.homeService.getRealtorHomeById(id);
    if (realtor_id !== user.id) throw new UnauthorizedException();
    return this.homeService.deleteHome(id);
  }


}


