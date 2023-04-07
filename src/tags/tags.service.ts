import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Flashcard, Tag } from '@prisma/client';
import { FlashcardTagDto } from './dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const { name, flashcardIds } = createTagDto;

    let flashcards: Flashcard[] | null = null;

    // Check if flashcardIds are valid
    if (flashcardIds && flashcardIds.length > 0) {
      flashcards = await this.prisma.flashcard.findMany({
        where: { id: { in: flashcardIds } },
      });

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

    return await this.prisma.tag.create({
      data: {
        name,
        flashcard: {
          connect: flashcards?.map((flashcard) => ({ id: flashcard.id })) || [],
        },
      },
    });
  }

  async findAll(): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({
      include: {
        flashcard: true,
      },
    });
    return tags;
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        flashcard: true,
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag #${id} not found`);
    }

    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.prisma.tag.update({
      where: { id },
      data: {
        ...updateTagDto,
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag #${id} not found`);
    }

    return tag;
  }

  async remove(id: string): Promise<void> {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException(`Tag #${id} not found`);
    }

    await this.prisma.tag.delete({
      where: { id },
    });
  }

  async getFlashcards(id: string): Promise<FlashcardTagDto[]> {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        flashcard: true,
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag #${id} not found`);
    }

    return tag.flashcard.map((flashcard) => ({
      id: flashcard.id,
      question: flashcard.question,
      answer: flashcard.answer,
    }));
  }

  async getFlashcard(
    tagId: string,
    flashcardId: string
  ): Promise<FlashcardTagDto> {
    const flashcard = await this.prisma.flashcard.findFirst({
      where: {
        id: flashcardId,
        tag: {
          some: {
            id: tagId,
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
