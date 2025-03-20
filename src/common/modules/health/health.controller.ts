import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { IAppConfig } from '../../configs/app.config';
import { ConfigNames } from 'src/common/types/config-names.enum';

@Controller()
export class HealthController {
  private _config: IAppConfig;
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private readonly _configService: ConfigService,
  ) {
    this._config = this._configService.getOrThrow<IAppConfig>(ConfigNames.APP);
  }

  @Get('health')
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck(
          'api',
          `http://localhost:${this._config.port}/api/dummy`,
        ),
      () => this.db.pingCheck('database'),
    ]);
  }

  @Get('dummy')
  async dummy() {
    return 'dummy';
  }
}
