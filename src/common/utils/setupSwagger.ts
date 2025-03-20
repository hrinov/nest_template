import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('App API')
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        name: 'authorization',
        description: 'Access token',
        in: 'header',
        type: 'apiKey',
      },
      'user',
    )
    .addBearerAuth(
      {
        name: 'authorization',
        description: 'Admin access token',
        in: 'header',
        type: 'apiKey',
      },
      'admin',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
};
