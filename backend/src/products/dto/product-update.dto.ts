import { IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class ProductUpdateDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  status?: 'DRAFT' | 'ACTIVE' | 'BLOCKED';
}
