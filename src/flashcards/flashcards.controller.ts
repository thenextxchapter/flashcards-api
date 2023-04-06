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
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { FlashcardEntity } from './entities/flashcard.entity';
import { Flashcard } from '@prisma/client';

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
}
