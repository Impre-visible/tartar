import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(process.env.BACKEND_PORT ?? 3000);
  console.log('\n\n[Tartar] - Backend is running on port', process.env.BACKEND_PORT ?? 3000, '\n\n');
}
bootstrap();
