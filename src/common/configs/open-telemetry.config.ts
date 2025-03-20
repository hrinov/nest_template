import { registerAs } from '@nestjs/config';
import { ConfigNames } from '../types/config-names.enum';

export interface IOpenTelemetryConfig {
  enabled?: boolean;
  jaegerCollectorHost?: string;
  jaegerCollectorHttpPort?: string;
}

export const getOpenTelemetryConfig = () => {
  const enabled = process.env.OPEN_TELEMETRY_ENABLED === 'true';
  const jaegerCollectorHost = process.env.OPEN_TELEMETRY_JAEGER_COLLECTOR_HOST;
  const jaegerCollectorHttpPort =
    process.env.OPEN_TELEMETRY_JAEGER_COLLECTOR_HTTP_PORT;

  const config: IOpenTelemetryConfig = {
    enabled,
    jaegerCollectorHost,
    jaegerCollectorHttpPort,
  };

  return config;
};

export const openTelemetryConfig = registerAs(
  ConfigNames.OPEN_TELEMETRY,
  getOpenTelemetryConfig,
);
