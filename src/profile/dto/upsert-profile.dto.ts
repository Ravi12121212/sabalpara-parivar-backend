import { IsString, IsOptional, IsInt, Min, ValidateNested, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';
import { FamilyMemberDto } from './family-member.dto';

export class UpsertProfileDto {
  @IsOptional()
  @IsString()
  village?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number; // main user age

  @IsOptional()
  @IsInt()
  @Min(0)
  totalFamilyMembers?: number;

  @IsOptional()
  @IsString()
  currentAddress?: string;

  @IsOptional()
  @IsString()
  businessDetails?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  cityName?: string;

  @IsOptional()
  @IsString()
  businessType?: string; // personal | job | none

  @ValidateNested({ each: true })
  @Type(() => FamilyMemberDto)
  @IsOptional()
  @ArrayMaxSize(50)
  familyMembers?: FamilyMemberDto[];
}
