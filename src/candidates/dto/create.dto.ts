import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateCandidateDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullName: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  @ApiProperty()
  resumeLink: string;
}
