import { ApiProperty } from '@nestjs/swagger';
import { Flashcard } from '@prisma/client';

export class FlashcardEntity implements Flashcard {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  question: string;

  @ApiProperty()
  answer: string;
}
