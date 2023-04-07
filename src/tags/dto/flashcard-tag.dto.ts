import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FlashcardTagDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  question: string;

  @IsString()
  @ApiProperty()
  answer: string;
}
