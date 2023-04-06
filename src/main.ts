import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // Ensures that we can't pass any extra values than what we need
    })
  );
  const config = new DocumentBuilder()
    .setTitle('Flashcard API')
    .setDescription(
      'Create, organize & review flashcards. Features review & quiz modes, user auth via JWT tokens & Swagger/OpenAPI docs.'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document);

  await app.listen(3000);
}
bootstrap();
