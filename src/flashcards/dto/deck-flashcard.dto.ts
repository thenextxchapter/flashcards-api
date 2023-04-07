import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeckFlashcardDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  description: string;
}
