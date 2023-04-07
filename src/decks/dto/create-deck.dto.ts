import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateDeckDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description: string;

  @IsString()
  @ApiProperty()
  userId: string;

  @IsString({ each: true })
  @ApiProperty()
  @IsArray()
  flashcardIds: string[];
}
