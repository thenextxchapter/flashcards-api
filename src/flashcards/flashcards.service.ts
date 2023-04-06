import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlashcardDto } from './dto';
import { UpdateFlashcardDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Flashcard } from '@prisma/client';

@Injectable()
export class FlashcardsService {
  constructor(private prisma: PrismaService) {}

  async create(createFlashcardDto: CreateFlashcardDto): Promise<Flashcard> {
    const { question, answer, deckIds, tagIds } = createFlashcardDto;

    const flashcard = await this.prisma.flashcard.create({
      data: {
        question,
        answer,
        decks: {
          connect: deckIds.map((id) => ({ id })),
        },
        tag: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
    });
    return flashcard;
  }

  async findAll(): Promise<Flashcard[]> {
    return this.prisma.flashcard.findMany({
      include: {
        decks: true,
        tag: true,
      },
    });
  }

  async findOne(id: string): Promise<Flashcard> {
    const flashcard = await this.prisma.flashcard.findUnique({
      where: { id },
      include: {
        decks: true,
        tag: true,
      },
    });

    if (!flashcard) {
      throw new NotFoundException(`Flashcard #${id} not found`);
    }
    return flashcard;
  }

  async update(
    id: string,
    updateFlashcardDto: UpdateFlashcardDto
  ): Promise<Flashcard> {
    const flashcard = await this.prisma.flashcard.update({
      where: { id },
      data: {
        ...updateFlashcardDto,
      },
    });

    if (!flashcard) {
      throw new NotFoundException(`Flashcard #${id} not found`);
    }
    return flashcard;
  }

  async remove(id: string): Promise<void> {
    const flashcard = await this.prisma.flashcard.findUnique({
      where: { id },
    });

    if (!flashcard) {
      throw new NotFoundException(`Flashcard #${id} not found`);
    }

    await this.prisma.flashcard.delete({
      where: { id },
    });
  }
}
