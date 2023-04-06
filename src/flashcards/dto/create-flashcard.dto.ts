import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateFlashcardDto {
  @IsString()
  @ApiProperty()
  question: string;

  @IsString()
  @ApiProperty()
  answer: string;

  @IsArray()
  @ApiProperty()
  deckIds: string[];

  @IsArray()
  @ApiProperty()
  tagIds: string[];
}
