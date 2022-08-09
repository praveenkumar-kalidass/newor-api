const opentelemetry = require('@opentelemetry/api');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const tracing = (serviceName) => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [],
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(new JaegerExporter({
    host: 'jaeger',
  })));
  provider.register();

  const tracer = opentelemetry.trace.getTracer(serviceName);

  return tracer;
};

module.exports = tracing;
