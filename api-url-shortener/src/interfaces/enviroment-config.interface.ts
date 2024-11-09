export interface EnvironmentConfigInterface {
  getDatabaseHost(): string;
  getRabbitMqUrl(): string;
  getRabbitMqQueue(): string;
}
