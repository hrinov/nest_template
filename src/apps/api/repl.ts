import { repl } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  await repl(AppModule);
}
bootstrap();
// example:
// yarn start:api:repl
// and then you can use: await get(*class we need to explore*)
