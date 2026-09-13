import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrdersList from '../../../components/OrdersList';
import { Order } from '../../../types';

describe('OrdersList Component', () => {
  const mockOrders: Order[] = [
    {
      id: '1',
      trackingNumber: 'TRK-998877',
      customerName: 'Empresa Alfa',
      destinationAddress: 'Av. Providencia 1234',
      status: 'IN_TRANSIT',
      createdAt: new Date().toISOString(),
    },
  ];

  it('debe renderizar el título y las órdenes recibidas por props', () => {
    render(
      <OrdersList
        orders={mockOrders}
        onSeedOrders={jest.fn()}
        onSimulateTelemetry={jest.fn()}
      />
    );

    expect(screen.getByText('Órdenes de Despacho')).toBeInTheDocument();
    expect(screen.getByText('TRK-998877')).toBeInTheDocument();
    expect(screen.getByText('Empresa Alfa')).toBeInTheDocument();
    expect(screen.getByText('En Tránsito')).toBeInTheDocument();
  });

  it('debe llamar a onSeedOrders al hacer clic en Sembrar 5 Órdenes', () => {
    const onSeedOrders = jest.fn();
    render(
      <OrdersList
        orders={[]}
        onSeedOrders={onSeedOrders}
        onSimulateTelemetry={jest.fn()}
      />
    );

    const button = screen.getByText('Sembrar 5 Órdenes');
    fireEvent.click(button);

    expect(onSeedOrders).toHaveBeenCalledTimes(1);
  });
});
