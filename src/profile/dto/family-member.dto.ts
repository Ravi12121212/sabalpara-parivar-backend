import { IsString, IsOptional, IsInt, Min, IsIn } from 'class-validator';

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
  @IsIn(['અભ્યાસ', 'વ્યવસાય', 'કોઈનહીં'])
  activityType?: string;

  @IsOptional()
  @IsIn(['વ્યક્તિગત', 'નોકરી', 'કોઈનહીં'])
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
  @IsIn( ['પિતા','માતા','પત્ની','પુત્ર','પુત્રી','ભાઈ','અન્ય'])
  relation?: string;

  @IsOptional()
  @IsIn(['ગૃહિણી','નિવૃત્ત','બાળક'])
  noneCategory?: string;
}
