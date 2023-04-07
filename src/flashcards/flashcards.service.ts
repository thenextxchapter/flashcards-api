import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlashcardDto, DeckFlashcardDto } from './dto';
import { UpdateFlashcardDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Flashcard } from '@prisma/client';
import { TagFlashcardDto } from './dto/tag-flashcard.dto';

@Injectable()
export class FlashcardsService {
  constructor(private prisma: PrismaService) {}

  async create(createFlashcardDto: CreateFlashcardDto): Promise<Flashcard> {
    const { question, answer, deckIds, tagIds } = createFlashcardDto;

    // Check if deckIds are valid
    if (deckIds?.length) {
      const validDeckIds = await this.prisma.deck.findMany({
        where: { id: { in: deckIds } },
        select: { id: true },
      });
      if (validDeckIds.length !== deckIds.length) {
        throw new NotFoundException(
          `Decks: ${deckIds.filter(
            (id) => !validDeckIds.map((deck) => deck.id).includes(id)
          )} were not found`
        );
      }
    }

    // Check if tagIds are valid
    if (tagIds?.length) {
      const validTagIds = await this.prisma.tag.findMany({
        where: { id: { in: tagIds } },
        select: { id: true },
      });
      if (validTagIds.length !== tagIds.length) {
        throw new NotFoundException(
          `Tags: ${tagIds.filter(
            (id) => !validTagIds.map((tag) => tag.id).includes(id)
          )} were not found`
        );
      }
    }

    const flashcard = await this.prisma.flashcard.create({
      data: {
        question,
        answer,
        decks: deckIds ? { connect: deckIds.map((id) => ({ id })) } : undefined,
        tag: tagIds ? { connect: tagIds.map((id) => ({ id })) } : undefined,
      },
    });
    return flashcard;
  }

  async findAll(): Promise<Flashcard[]> {
    const flashcards = await this.prisma.flashcard.findMany({
      include: {
        decks: true,
        tag: true,
      },
    });
    return flashcards;
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

  async getDecks(id: string): Promise<DeckFlashcardDto[]> {
    const flashcard = await this.prisma.flashcard.findUnique({
      where: { id },
      include: {
        decks: true,
      },
    });

    if (!flashcard) {
      throw new NotFoundException(`Flashcard #${id} not found`);
    }

    return flashcard.decks.map((deck) => ({
      id: deck.id,
      title: deck.title,
      description: deck.description,
    }));
  }

  async getTags(id: string): Promise<TagFlashcardDto[]> {
    const flashcard = await this.prisma.flashcard.findUnique({
      where: { id },
      include: {
        tag: true,
      },
    });

    if (!flashcard) {
      throw new NotFoundException(`Flashcard #${id} not found`);
    }

    return flashcard.tag.map((tag) => ({
      id: tag.id,
      name: tag.name,
    }));
  }

  async getDeck(
    flashcardId: string,
    deckId: string
  ): Promise<DeckFlashcardDto | null> {
    const deck = await this.prisma.deck.findFirst({
      where: {
        id: deckId,
        flashcards: {
          some: {
            id: flashcardId,
          },
        },
      },
    });

    if (!deck) {
      return null;
    }

    return {
      id: deck.id,
      title: deck.title,
      description: deck.description,
    };
  }

  async getTag(
    flashcardId: string,
    tagId: string
  ): Promise<TagFlashcardDto | null> {
    const tag = await this.prisma.tag.findFirst({
      where: {
        id: tagId,
        flashcard: {
          some: {
            id: flashcardId,
          },
        },
      },
    });

    if (!tag) {
      return null;
    }

    return {
      id: tag.id,
      name: tag.name,
    };
  }
}
