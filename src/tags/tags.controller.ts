import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { TagEntity } from './entities/tag.entity';
import { Tag } from '@prisma/client';
import { FlashcardTagDto } from './dto';

@ApiTags('Tags')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiCreatedResponse({ type: TagEntity })
  create(@Body() createTagDto: CreateTagDto): Promise<TagEntity> {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  @ApiOkResponse({ type: [TagEntity], description: 'Returns all tags' })
  findAll(): Promise<TagEntity[]> {
    return this.tagsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: TagEntity, description: 'Returns one tag' })
  findOne(@Param('id') id: string): Promise<Tag> {
    return this.tagsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TagEntity })
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Deletes a tag',
  })
  remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }

  @Get(':id/flashcards')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The id of the tag',
  })
  @ApiOkResponse({
    type: [FlashcardTagDto],
    description: 'Returns all flashcards with the given tag',
  })
  getFlashcards(@Param('id') id: string): Promise<FlashcardTagDto[]> {
    return this.tagsService.getFlashcards(id);
  }

  @Get(':id/flashcards/:flashcardId')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The id of the tag',
  })
  @ApiParam({
    name: 'flashcardId',
    type: 'string',
    required: true,
    description: 'The id of the flashcard',
  })
  @ApiOkResponse({
    type: FlashcardTagDto,
    description: 'Returns one flashcard with the given tag',
  })
  getFlashcard(
    @Param('id') id: string,
    @Param('flashcardId') flashcardId: string
  ): Promise<FlashcardTagDto> {
    return this.tagsService.getFlashcard(id, flashcardId);
  }
}
