import { ApiProperty } from '@nestjs/swagger';
import { Deck } from '@prisma/client';

export class DeckEntity implements Deck {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  userId: string;
}
