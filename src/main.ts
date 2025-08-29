import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger, RequestMethod } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Custom request logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestLogger = new Logger('Request');
    const { method, originalUrl, headers, body } = req;
    const timestamp = new Date().toISOString();
    
    // Sanitize sensitive data (e.g., hide authorization token)
    const sanitizedHeaders = { ...headers };
    if (sanitizedHeaders.authorization) {
      sanitizedHeaders.authorization = '[REDACTED]';
    }
    
    // Avoid logging sensitive body fields (e.g., password)
    const sanitizedBody = { ...body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '[REDACTED]';
    }

    requestLogger.log({
      timestamp,
      method,
      url: originalUrl,
      headers: sanitizedHeaders,
      body: sanitizedBody,
    });

    next();
  });

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
    .setTitle('EscrowSecure API')
    .setDescription(
      'API for EscrowSecure, a Nigerian e-commerce escrow platform facilitating secure transactions with escrow and dispute resolution features.',
    )
    .setVersion('1.0')
    .setContact('Support Team', 'https://escrowsecure.ng', 'support@escrowsecure.ng')
    .setTermsOfService('https://escrowsecure.ng/terms')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:5000/api', 'Development')
    .addServer('https://api.escrowsecure.ng', 'Production')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
        description: 'Enter JWT token in the format: Bearer <access_token>. Obtain via POST /auth/login.',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      tryItOutEnabled: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      docExpansion: 'list',
    },
    customSiteTitle: 'EscrowSecure API Documentation',
    customCss: `
      .swagger-ui .topbar { background-color: #1a202c; }
      .swagger-ui .auth-container .auth-btn-wrapper { margin-top: 10px; }
      .swagger-ui .auth-container label { font-weight: bold; }
    `,
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