import { useContainer } from 'class-validator';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule, initNestApp } from './app.module';

function attachSwaggerModule(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('viAct API')
    .setDescription('viAct API description')
    // .addBearerAuth()
    .setVersion(process.env.npm_package_version || '')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable dependency injection for validator class
  useContainer(app.select(AppModule), {
    fallback: true,
    fallbackOnErrors: true,
  });

  initNestApp(app);
  // enable api documentation
  attachSwaggerModule(app);

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
