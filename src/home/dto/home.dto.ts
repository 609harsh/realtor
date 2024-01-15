import { PropertyType} from "@prisma/client";
import { Exclude, Expose, Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";

export class HomeDto{
  id: number;
  address:string;
  @Exclude()
  number_of_bedrooms: number;
  @Expose({name:"numberOfBedrooms"})
  numberOfBedrooms(){
    return this.number_of_bedrooms
  }
  @Exclude()
  number_of_bathrooms: number;
  @Expose({name:"numberOfBathrooms"})
  numberOfBathrooms(){
    return this.number_of_bathrooms
  }
  city: string;
  listed_date: Date;
  price: number;
  land_size: number;
  property_type: PropertyType;
  @Exclude()
  realtor_id: number;


  constructor(partial:Partial<HomeDto>){
    Object.assign(this,partial);
  }
}

export class Image{
  @IsString()
  @IsNotEmpty()
  url:string
}


export class CreateHomeDto{

  @IsString()
  @IsNotEmpty()
  address:string;
  
  @IsNotEmpty()
  @IsPositive()
  number_of_bedrooms: number;
  
  @IsNotEmpty()
  @IsPositive()
  number_of_bathrooms: number;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsNotEmpty()
  @IsPositive()
  price: number;
  @IsNotEmpty()
  @IsPositive()
  land_size: number;
  @IsEnum(PropertyType)
  property_type: PropertyType;
  
  @IsArray()
  @ValidateNested({each:true})
  @Type(()=>Image)
  images:Image[]

}


export class UpdateHomeDto{
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?:string;
  @IsOptional()
  @IsNotEmpty()
  @IsPositive()
  number_of_bedrooms?: number;
  @IsOptional()
  @IsNotEmpty()
  @IsPositive()
  number_of_bathrooms?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsPositive()
  land_size?: number;
  @IsOptional()
  @IsEnum(PropertyType)
  property_type?: PropertyType;

}