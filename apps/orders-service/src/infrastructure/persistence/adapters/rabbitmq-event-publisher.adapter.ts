import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventPublisherPort } from '../../../domain/ports/event-publisher.port';

@Injectable()
export class RabbitMqEventPublisherAdapter implements EventPublisherPort {
    constructor(
        @Inject('RABBITMQ_SERVICE')
        private readonly client: ClientProxy,
    ) {}

    async publish<T>(pattern: string, data: T): Promise<void> {
        this.client.emit(pattern, data);
    }
}