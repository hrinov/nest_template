import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { IAppConfig } from '../../common/configs/app.config';
import { CustomExceptionFilter } from '../../common/exceptions/custom-exptectation-filter';
import { ConfigNames } from 'src/common/types/config-names.enum';
import { setupSwagger } from '../../common/utils/setupSwagger';
import { mw as ipMiddleware } from 'request-ip';
import { AppModule } from './app.module';
import { OpenTelemetryManager } from 'src/common/services/open-telemetry.service';
import {
  booleanStringToBoolean,
  TBooleanString,
} from 'src/common/utils/boolean-string-to-boolean';

async function bootstrap() {
  const isProd = booleanStringToBoolean(
    process.env.IS_PROD_ENVIRONMENT as TBooleanString,
  );
  const telemetryAppName = isProd ? 'consumer-prod' : 'consumer-dev';
  new OpenTelemetryManager(telemetryAppName).bootstrap();

  const app = await NestFactory.create(AppModule, {});

  app.useGlobalPipes(new ValidationPipe({}));
  app.useGlobalFilters(new CustomExceptionFilter());
  app.use(ipMiddleware());
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: true,
  });

  setupSwagger(app);

  const configService = app.get(ConfigService);
  const config = configService.get<IAppConfig>(ConfigNames.APP);

  if (!config) {
    throw new Error('App config does not exists');
  }

  const logger = new Logger('App');

  await app.listen(config.port, '0.0.0.0', async () => {
    logger.log(`Service "Consumers" started on ${await app.getUrl()}`);
  });
}
bootstrap();
