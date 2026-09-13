export const EVENT_PUBLISHER_PORT = Symbol('EVENT_PUBLISHER_PORT');

export interface EventPublisherPort {
  publish<T>(pattern: string, data: T): Promise<void>;
}