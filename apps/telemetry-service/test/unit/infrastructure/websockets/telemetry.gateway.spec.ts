import { TelemetryGateway } from 'src/infrastructure/websockets/telemetry.gateway';
import { RecordLocationUseCase } from 'src/application/use-cases/record-location.use-case';
import { TelemetryPoint } from 'src/domain/entities/telemetry-point.entity';
import { RecordLocationDto } from 'src/application/dtos/record-location.dto';

describe('TelemetryGateway', () => {
  let gateway: TelemetryGateway;
  let recordLocationUseCaseMock: jest.Mocked<RecordLocationUseCase>;
  let socketMock: any;
  let serverMock: any;

  beforeEach(() => {
    recordLocationUseCaseMock = {
      execute: jest.fn(),
    } as any;

    socketMock = {
      id: 'socket-id-123',
      join: jest.fn(),
    };

    serverMock = {
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
    };

    gateway = new TelemetryGateway(recordLocationUseCaseMock);
    gateway.server = serverMock as any;
  });

  it('debe permitir a un cliente unirse a la sala handleJoinRoom', () => {
    const result = gateway.handleJoinRoom(socketMock, { trackingNumber: 'TRK-100' });

    expect(socketMock.join).toHaveBeenCalledWith('room_TRK-100');
    expect(result).toEqual({ status: 'JOINED', room: 'room_TRK-100' });
  });

  it('debe registrar ubicación y emitir por WebSockets handleLocationUpdate', async () => {
    const dto: RecordLocationDto = {
      orderId: 'o-1',
      trackingNumber: 'TRK-100',
      driverId: 'd-1',
      latitude: -33.4,
      longitude: -70.6,
      speedKmH: 50,
      batteryLevel: 90,
    };

    const point = new TelemetryPoint('p-1', 'o-1', 'TRK-100', 'd-1', -33.4, -70.6, 50, 90, new Date());
    recordLocationUseCaseMock.execute.mockResolvedValue(point);

    const result = await gateway.handleLocationUpdate(dto);

    expect(recordLocationUseCaseMock.execute).toHaveBeenCalledWith(dto);
    expect(serverMock.to).toHaveBeenCalledWith('room_TRK-100');
    expect(result).toEqual({ status: 'SUCCESS', pointId: 'p-1' });
  });
});
