import { Logger } from '@nestjs/common';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { TypeormInstrumentation } from 'opentelemetry-instrumentation-typeorm';
import {
  getOpenTelemetryConfig,
  IOpenTelemetryConfig,
} from '../configs/open-telemetry.config';

export class OpenTelemetryManager {
  private readonly logger = new Logger(OpenTelemetryManager.name);
  private readonly openTelemetryConfig: IOpenTelemetryConfig;
  appName = 'Stars';

  constructor(appName: string) {
    this.openTelemetryConfig = getOpenTelemetryConfig();
    this.appName = appName;
  }

  public bootstrap(): void {
    if (this.openTelemetryConfig.enabled) {
      this.create().start();
    }
  }

  private create(): NodeSDK {
    const jaegerHost = `http://${this.openTelemetryConfig.jaegerCollectorHost}:${this.openTelemetryConfig.jaegerCollectorHttpPort}`;

    const traceExporter = new OTLPTraceExporter({
      url: `${jaegerHost}/v1/traces`,
    });

    const metricExporter = new OTLPMetricExporter({
      url: `${jaegerHost}/v1/metrics`,
    });

    const sdk = new NodeSDK({
      serviceName: this.appName || 'Stars',
      autoDetectResources: true,
      traceExporter,
      metricReader: new PeriodicExportingMetricReader({
        exporter: metricExporter,
      }) as any,
      spanProcessors: [new BatchSpanProcessor(traceExporter)],
      contextManager: new AsyncLocalStorageContextManager(),
      textMapPropagator: new CompositePropagator({
        propagators: [
          new JaegerPropagator(),
          new W3CTraceContextPropagator(),
          new W3CBaggagePropagator(),
          new B3Propagator({
            injectEncoding: B3InjectEncoding.MULTI_HEADER,
          }),
        ],
      }),
      instrumentations: [
        getNodeAutoInstrumentations(),
        new TypeormInstrumentation({
          collectParameters: true,
        }),
        new NestInstrumentation(),
      ],
    });

    this.registerProcessExitHandler(sdk);
    return sdk;
  }

  private registerProcessExitHandler(sdk: NodeSDK): void {
    let isShuttingDown = false;

    process.on('SIGTERM', () => {
      if (isShuttingDown) {
        return;
      }

      isShuttingDown = true;

      sdk
        .shutdown()
        .then(() => {
          return this.logger.log('OpenTelemetry SDK shut down successfully.');
        })
        .finally(() => {
          process.exit(0);
        })
        .catch((error) => {
          this.logger.error('Error during shutdown:', error);
        });
    });
  }
}
