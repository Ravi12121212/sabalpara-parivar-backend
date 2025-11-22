import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreatePreviousYearResultDto {
  @IsString() @IsNotEmpty()
  gamnuName!: string;

  @IsString() @IsNotEmpty()
  currentResidenceCity!: string;

  @IsString() @IsNotEmpty()
  fatherFullName!: string;

  @IsString() @IsNotEmpty()
  studentFullName!: string;

  @IsString() @IsNotEmpty()
  mobileNumber!: string; // could add regex later

  @IsString() @IsNotEmpty()
  currentStudyYear_25_26!: string; // e.g. "BSc 2nd Year"

  @IsString() @IsNotEmpty()
  currentStudyYear_24_25!: string; // e.g. "BSc 1st Year"

  @IsNumber() @Min(0) @Max(100)
  percentage!: number;

  @IsOptional() @IsString()
  resultFileUrl?: string; // URL after upload
}
