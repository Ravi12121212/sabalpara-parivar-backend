import { IsString, IsOptional, IsInt, Min, IsNumber, Max, IsIn } from 'class-validator';

export class FamilyMemberDto {
  @IsString()
  memberName!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;

  @IsOptional()
  @IsString()
  std?: string;

  @IsOptional()
  @IsString()
  resultImage?: string; // URL

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage?: number;

  @IsOptional()
  @IsIn(['study', 'business', 'none'])
  activityType?: string;

  @IsOptional()
  @IsIn(['personal', 'job', 'none'])
  businessWorkType?: string;

  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  businessDescription?: string;

  @IsOptional()
  @IsString()
  memberPhone?: string;

  @IsOptional()
  @IsIn(['father','son','daughter','mother','wife','brother','other'])
  relation?: string;

  @IsOptional()
  @IsIn(['house_wife','retired','child'])
  noneCategory?: string;
}
