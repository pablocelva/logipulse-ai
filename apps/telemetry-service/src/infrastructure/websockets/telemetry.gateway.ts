import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RecordLocationUseCase } from '../../application/use-cases/record-location.use-case';
import { RecordLocationDto } from '../../application/dtos/record-location.dto';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
export class TelemetryGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly recordLocationUseCase: RecordLocationUseCase) {}

  @SubscribeMessage('joinTrackingRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { trackingNumber: string },
  ) {
    const roomName = `room_${data.trackingNumber}`;
    client.join(roomName);
    console.log(`🔌 Cliente ${client.id} unido a la sala: ${roomName}`);
    return { status: 'JOINED', room: roomName };
  }

  @SubscribeMessage('driverLocationUpdate')
  async handleLocationUpdate(@MessageBody() dto: RecordLocationDto) {
    // 1. Guardar en MongoDB
    const point = await this.recordLocationUseCase.execute(dto);

    // 2. Emitir en tiempo real a los clientes suscritos al mapa de ese trackingNumber
    const roomName = `room_${dto.trackingNumber}`;
    this.server.to(roomName).emit('locationUpdated', point);

    return { status: 'SUCCESS', pointId: point.id };
  }
}
