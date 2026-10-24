import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from "cookie-parser";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 1. Configure the Swagger Document Builder

  app.enableCors({
    // Replace with your actual frontend URL(s)
    origin: ['http://localhost:3000', 'https://yourdomain.com'], 
    
    // Explicitly define allowed methods
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    
    // Explicitly define allowed headers
    allowedHeaders: 'Content-Type, Accept, Authorization', 
    
    // Allow cookies / authorization headers to be passed from the frontend
    credentials: true, 
  });
  const config = new DocumentBuilder()
    .setTitle('NestJS API Documentation')
    .setDescription('Auto-generated API documentation for the application')
    .setVersion('1.0')
    .addBearerAuth() // Adds JWT Authentication button support in UI
    .build();

  // 2. Create the document and setup the endpoint routing
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true
  }))
  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
