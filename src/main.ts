// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe for DTO validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Enable CORS for frontend integration
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL', 'http://localhost:3000'),
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Escrow Platform API')
    .setDescription(
      'API for a Nigerian e-commerce escrow platform facilitating secure transactions with escrow and dispute resolution features.',
    )
    .setVersion('1.0')
    .setContact('Support Team', 'http://localhost:5000', 'http://localhost:5000')
    .setTermsOfService('https://escrow.ng/terms')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:5000', 'Production')
    .addServer('http://localhost:5000', 'Development')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Log MongoDB URI (connection status will be handled elsewhere)
  logger.log(`MongoDB URI: ${configService.get<string>('MONGODB_URI')}`);

  // Start the server
  const port = configService.get<number>('PORT', 5000);
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap().catch((err) => {
  console.error('Bootstrap error:', err);
  process.exit(1);
});