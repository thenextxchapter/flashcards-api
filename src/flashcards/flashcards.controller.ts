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
import { FlashcardsService } from './flashcards.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { FlashcardEntity } from './entities/flashcard.entity';
import { Flashcard } from '@prisma/client';
import { DeckFlashcardDto } from './dto';
import { TagFlashcardDto } from './dto/tag-flashcard.dto';

@ApiTags('Flashcards')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('flashcards')
export class FlashcardsController {
  constructor(private flashcardsService: FlashcardsService) {}

  @Post()
  @ApiCreatedResponse({ type: FlashcardEntity })
  create(@Body() createFlashcardDto: CreateFlashcardDto): Promise<Flashcard> {
    return this.flashcardsService.create(createFlashcardDto);
  }

  @Get()
  @ApiOkResponse({
    type: [FlashcardEntity],
    description: 'Returns all flashcards',
  })
  findAll(): Promise<Flashcard[]> {
    return this.flashcardsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: FlashcardEntity,
    description: 'Returns one flashcard',
  })
  findOne(@Param('id') id: string): Promise<Flashcard> {
    return this.flashcardsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: FlashcardEntity })
  update(
    @Param('id') id: string,
    @Body() updateFlashcardDto: UpdateFlashcardDto
  ): Promise<Flashcard> {
    return this.flashcardsService.update(id, updateFlashcardDto);
  }

  @Delete(':id')
  @ApiOkResponse()
  remove(@Param('id') id: string) {
    return this.flashcardsService.remove(id);
  }

  @Get(':id/decks')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The id of the flashcard',
  })
  @ApiOkResponse({
    type: [DeckFlashcardDto],
    description: 'Returns all decks that contain the flashcard',
  })
  getDecks(@Param('id') id: string): Promise<DeckFlashcardDto[]> {
    return this.flashcardsService.getDecks(id);
  }

  @Get(':id/decks/:deckId')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The id of the flashcard',
  })
  @ApiParam({
    name: 'deckId',
    type: 'string',
    required: true,
    description: 'The id of the deck',
  })
  @ApiOkResponse({
    type: DeckFlashcardDto,
    description: 'Returns one deck that contains the flashcard',
  })
  getDeck(
    @Param('id') id: string,
    @Param('deckId') deckId: string
  ): Promise<DeckFlashcardDto> {
    return this.flashcardsService.getDeck(id, deckId);
  }

  @Get(':id/tags')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The id of the flashcard',
  })
  @ApiOkResponse({
    type: [TagFlashcardDto],
    description: 'Returns all tags that contain the flashcard',
  })
  getTags(@Param('id') id: string): Promise<TagFlashcardDto[]> {
    return this.flashcardsService.getTags(id);
  }

  @Get(':id/tags/:tagId')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The id of the flashcard',
  })
  @ApiParam({
    name: 'tagId',
    type: 'string',
    required: true,
    description: 'The id of the tag',
  })
  @ApiOkResponse({
    type: TagFlashcardDto,
    description: 'Returns one tag that contains the flashcard',
  })
  getTag(
    @Param('id') id: string,
    @Param('tagId') tagId: string
  ): Promise<TagFlashcardDto> {
    return this.flashcardsService.getTag(id, tagId);
  }
}
