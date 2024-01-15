import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeDto, HomeDto, UpdateHomeDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

interface GetQueryParam{
  city?:string,
  price?:{
    gte:number,
    lte:number,
  }
  propertyType?:PropertyType,
}


@Injectable()
export class HomeService {
  constructor (private readonly prismaService:PrismaService){}
  async getHomes(filter:GetQueryParam):Promise<HomeDto[]>{
    const homes=await this.prismaService.home.findMany({
      select:{
        id:true,
        address:true,
        city:true,
        price:true,
        property_type:true,
        number_of_bathrooms:true,
        number_of_bedrooms:true,
        images:{
          select:{
            url:true
          },
          take:1,
        }
      },
      where:{
        ...filter
      }
    });
    return homes.map((home)=>new HomeDto(home));
  }

  async getHomeById(id:number){
    const home=this.prismaService.home.findFirst({where:{id}})
    return home;
  }


  async createHome({images,price,address,city,land_size,number_of_bathrooms,number_of_bedrooms,property_type}:CreateHomeDto,id:number){
    const home=await this.prismaService.home.create({
      data:{
        price,
        address,
        city,
        land_size,
        number_of_bathrooms,
        number_of_bedrooms,
        property_type,
        realtor_id:id,
      }
    });

    const image=images.map((image)=>{
      return {...image,home_id:home.id}
    });

    await this.prismaService.image.createMany({data:image});
    return home;
  }

  async updateHome(body:UpdateHomeDto,id:number){
    const home=await this.prismaService.home.findUnique({
      where:{
        id:id
      }
    })
    if(!home)throw new NotFoundException("Home noit found");

    const updatedHome=await this.prismaService.home.update({
      where:{
        id
      },
      data:body,
    })

    return updatedHome
  }

  async deleteHome(id:number){  
    const image=await this.prismaService.image.deleteMany({where:{home_id:id}})
    const home=await this.prismaService.home.delete({where:{id}})
    return home
  }

  async getRealtorHomeById(id:number) {
    const home = await this.prismaService.home.findUnique({ where: { id } });
    if (!home) throw new NotFoundException();
    return home.realtor_id;
  }
}


