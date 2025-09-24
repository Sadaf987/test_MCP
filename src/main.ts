import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Add global validation exception filter
  app.useGlobalFilters(new ValidationExceptionFilter());
  
  await app.listen(3001);
}
bootstrap();
