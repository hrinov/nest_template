import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService],
  imports: [JwtModule.register({})],
  exports: [TokensService],
})
export class TokensModule {}
