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
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { DeckEntity } from './entities/deck.entity';
import { Deck } from '@prisma/client';
import { FlashcardDeckDto } from './dto';

@ApiTags('Decks')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('decks')
export class DecksController {
  constructor(private decksService: DecksService) {}

  @Post()
  @ApiCreatedResponse({ type: DeckEntity })
  create(@Body() createDeckDto: CreateDeckDto): Promise<Deck> {
    return this.decksService.create(createDeckDto);
  }

  @Get()
  @ApiOkResponse({
    type: [DeckEntity],
    description: 'Returns all decks',
  })
  findAll(): Promise<Deck[]> {
    return this.decksService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: DeckEntity,
    description: 'Returns one deck',
  })
  findOne(@Param('id') id: string): Promise<Deck> {
    return this.decksService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: DeckEntity })
  update(
    @Param('id') id: string,
    @Body() updateDeckDto: UpdateDeckDto
  ): Promise<Deck> {
    return this.decksService.update(id, updateDeckDto);
  }

  @Delete(':id')
  @ApiOkResponse()
  remove(@Param('id') id: string) {
    return this.decksService.remove(id);
  }

  @Get(':id/flashcards')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The ID of the deck to retrieve',
  })
  @ApiOkResponse({
    description: 'The flashcards in the deck have been successfully retrieved',
    type: [FlashcardDeckDto],
  })
  async getFlashcards(@Param('id') id: string): Promise<FlashcardDeckDto[]> {
    return this.decksService.getFlashcards(id);
  }

  @Get(':id/flashcards/:flashcardId')
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The ID of the deck to retrieve',
  })
  @ApiParam({
    name: 'flashcardId',
    type: 'string',
    required: true,
    description: 'The ID of the flashcard to retrieve',
  })
  @ApiOkResponse({
    description: 'The flashcard in the deck has been successfully retrieved',
    type: FlashcardDeckDto,
  })
  async getFlashcard(
    @Param('id') id: string,
    @Param('flashcardId') flashcardId: string
  ): Promise<FlashcardDeckDto> {
    return this.decksService.getFlashcard(id, flashcardId);
  }
}
