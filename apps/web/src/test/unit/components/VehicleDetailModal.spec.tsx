import React from 'react';
import { render, screen } from '@testing-library/react';
import VehicleDetailModal from '../../../components/VehicleDetailModal';
import { api } from '../../../lib/api-client';

jest.mock('../../../lib/api-client', () => ({
  api: {
    telemetry: {
      getHistory: jest.fn().mockResolvedValue([
        {
          id: 'p1',
          trackingNumber: 'TRK-100001',
          latitude: -33.4255,
          longitude: -70.6148,
          speed: 55,
          batteryLevel: 90,
          timestamp: new Date().toISOString(),
        },
      ]),
    },
  },
}));

describe('VehicleDetailModal Component', () => {
  jest.setTimeout(15000);

  it('no debe renderizar nada cuando isOpen es false o trackingNumber es null', () => {
    const { container } = render(
      <VehicleDetailModal isOpen={false} trackingNumber={null} onClose={jest.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('debe renderizar la cabecera con el número de tracking cuando está abierto', async () => {
    render(
      <VehicleDetailModal
        isOpen={true}
        trackingNumber="TRK-100001"
        onClose={jest.fn()}
        orderInfo={{ merchantId: 'merchant-alpha', status: 'IN_TRANSIT' }}
      />
    );

    expect(await screen.findByText('TRK-100001')).toBeInTheDocument();
    expect(screen.getByText('merchant-alpha')).toBeInTheDocument();
    expect(screen.getByText('IN_TRANSIT')).toBeInTheDocument();
  });
});
