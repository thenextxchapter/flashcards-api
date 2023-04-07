import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { DecksModule } from './decks/decks.module';
import { FlashcardsModule } from './flashcards/flashcards.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DecksModule,
    FlashcardsModule,
    TagsModule,
  ],
})
export class AppModule {}
