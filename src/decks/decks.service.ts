import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Deck, Flashcard } from '@prisma/client';
import { FlashcardDeckDto } from './dto';

@Injectable()
export class DecksService {
  constructor(private prisma: PrismaService) {}

  async create(createDeckDto: CreateDeckDto): Promise<Deck> {
    const { title, description, userId, flashcardIds } = createDeckDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    let flashcards: Flashcard[] | null = null;

    // Check if flashcards exist
    if (flashcardIds && flashcardIds.length > 0) {
      flashcards = await this.prisma.flashcard.findMany({
        where: { id: { in: flashcardIds } },
      });
      // Check if existing flashcards are valid
      if (flashcards.length !== flashcardIds.length) {
        const validFlashcards = flashcards.map((flashcard) => flashcard.id);
        const invalidFlashcards = flashcardIds.filter(
          (id) => !validFlashcards.includes(id)
        );

        throw new NotFoundException(
          `flashcards: ${invalidFlashcards} were not found `
        );
      }
    }

    return await this.prisma.deck.create({
      data: {
        title,
        description,
        user: {
          connect: { id: userId },
        },
        flashcards: {
          connect: flashcards?.map((flashcard) => ({ id: flashcard.id })) || [],
        },
      },
    });
  }

  async findAll(): Promise<Deck[]> {
    const decks = await this.prisma.deck.findMany({
      include: {
        flashcards: true,
        user: true,
      },
    });
    return decks;
  }

  async findOne(id: string): Promise<Deck> {
    const deck = await this.prisma.deck.findUnique({
      where: { id },
      include: {
        flashcards: true,
        user: true,
      },
    });

    if (!deck) {
      throw new NotFoundException(`Deck #${id} not found`);
    }
    return deck;
  }

  async update(id: string, updateDeckDto: UpdateDeckDto): Promise<Deck> {
    const deck = await this.prisma.deck.update({
      where: { id },
      data: {
        ...updateDeckDto,
      },
    });

    if (!deck) {
      throw new NotFoundException(`Deck #${id} not found`);
    }

    return deck;
  }

  async remove(id: string): Promise<void> {
    const deck = await this.prisma.deck.findUnique({
      where: { id },
    });

    if (!deck) {
      throw new NotFoundException(`Deck #${id} not found`);
    }

    await this.prisma.deck.delete({
      where: { id },
    });
  }

  // Get all cards in a deck
  async getFlashcards(id: string): Promise<FlashcardDeckDto[]> {
    const deck = await this.prisma.deck.findUnique({
      where: { id },
      include: {
        flashcards: true,
      },
    });

    if (!deck) {
      throw new NotFoundException(`Deck #${id} not found`);
    }

    return deck.flashcards.map((flashcard) => ({
      id: flashcard.id,
      question: flashcard.question,
      answer: flashcard.answer,
    }));
  }

  // Get a single card in a deck
  async getFlashcard(
    deckId: string,
    flashcardId: string
  ): Promise<FlashcardDeckDto | null> {
    const flashcard = await this.prisma.flashcard.findFirst({
      where: {
        id: flashcardId,
        decks: {
          some: {
            id: deckId,
          },
        },
      },
    });

    if (!flashcard) {
      return null;
    }

    return {
      id: flashcard.id,
      question: flashcard.question,
      answer: flashcard.answer,
    };
  }
}
