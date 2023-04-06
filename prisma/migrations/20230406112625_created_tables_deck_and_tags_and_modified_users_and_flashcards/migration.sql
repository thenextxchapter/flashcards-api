/*
  Warnings:

  - You are about to drop the column `userId` on the `flashcards` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "flashcards" DROP CONSTRAINT "flashcards_userId_fkey";

-- AlterTable
ALTER TABLE "flashcards" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "decks" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "decks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FlashcardTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FlashcardDeck" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FlashcardTag_AB_unique" ON "_FlashcardTag"("A", "B");

-- CreateIndex
CREATE INDEX "_FlashcardTag_B_index" ON "_FlashcardTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FlashcardDeck_AB_unique" ON "_FlashcardDeck"("A", "B");

-- CreateIndex
CREATE INDEX "_FlashcardDeck_B_index" ON "_FlashcardDeck"("B");

-- AddForeignKey
ALTER TABLE "decks" ADD CONSTRAINT "decks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FlashcardTag" ADD CONSTRAINT "_FlashcardTag_A_fkey" FOREIGN KEY ("A") REFERENCES "flashcards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FlashcardTag" ADD CONSTRAINT "_FlashcardTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FlashcardDeck" ADD CONSTRAINT "_FlashcardDeck_A_fkey" FOREIGN KEY ("A") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FlashcardDeck" ADD CONSTRAINT "_FlashcardDeck_B_fkey" FOREIGN KEY ("B") REFERENCES "flashcards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
