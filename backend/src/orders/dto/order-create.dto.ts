import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

class OrderItemInput {
  @IsString()
  productId!: string;

  @IsInt()
  @Min(1)
  qty!: number;
}

export class OrderCreateDto {
  @IsArray()
  @ArrayMinSize(1)
  items!: OrderItemInput[];

  @IsOptional()
  shippingAddressJson?: any;

  @IsOptional()
  @IsString()
  notes?: string;
}
