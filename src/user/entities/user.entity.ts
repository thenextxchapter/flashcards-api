import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  email: string;

  @ApiProperty()
  hash: string;

  @ApiProperty({ required: false, nullable: true })
  firstName: string | null;

  @ApiProperty({ required: false, nullable: true })
  lastName: string | null;
}
