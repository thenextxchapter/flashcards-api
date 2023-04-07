import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '@prisma/client';

export class TagEntity implements Tag {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;
}
