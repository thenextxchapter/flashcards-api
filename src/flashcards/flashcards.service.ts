import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlashcardDto, DeckFlashcardDto } from './dto';
import { UpdateFlashcardDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Deck, Flashcard, Tag } from '@prisma/client';
import { TagFlashcardDto } from './dto/tag-flashcard.dto';

@Injectable()
export class FlashcardsService {
  constructor(private prisma: PrismaService) {}

  async create(createFlashcardDto: CreateFlashcardDto): Promise<Flashcard> {
    const { question, answer, deckIds, tagIds } = createFlashcardDto;

    let decks: Deck[] | null = null;
    let tags: Tag[] | null = null;

    // Check if deckIds are valid
    if (deckIds && deckIds.length > 0) {
      decks = await this.prisma.deck.findMany({
        where: { id: { in: deckIds } },
      });
      if (decks.length !== deckIds.length) {
        const validDecks = decks.map((deck) => deck.id);
        const invalidDecks = deckIds.filter((id) => !validDecks.includes(id));

        throw new NotFoundException(`Decks: ${invalidDecks} were not found `);
      }
    }

    // Check if tagIds are valid
    if (tagIds && tagIds.length > 0) {
      tags = await this.prisma.tag.findMany({
        where: { id: { in: tagIds } },
      });

      if (tags.length !== tagIds.length) {
        const validTags = tags.map((tag) => tag.id);
        const invalidTags = tagIds.filter((id) => !validTags.includes(id));

        throw new NotFoundException(`Tags: ${invalidTags} were not found `);
      }
    }

    const flashcard = await this.prisma.flashcard.create({
      data: {
        question,
        answer,
        decks: {
          connect: decks?.map((deck) => ({ id: deck.id })) || [],
        },
        tag: {
          connect: tags?.map((tag) => ({ id: tag.id })) || [],
        },
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
