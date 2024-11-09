export interface EnvironmentConfigInterface {
  getDatabaseHost(): string;
  getSecretKey(): string;
  getRabbitMqUrl(): string;
  getRabbitMqQueue(): string;
}
