import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateOrderModal from '../../../components/CreateOrderModal';

describe('CreateOrderModal Component', () => {
  it('no debe renderizar nada cuando isOpen es false', () => {
    const { container } = render(
      <CreateOrderModal isOpen={false} onClose={jest.fn()} onOrderCreated={jest.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('debe renderizar los campos del formulario cuando isOpen es true', () => {
    render(
      <CreateOrderModal isOpen={true} onClose={jest.fn()} onOrderCreated={jest.fn()} />
    );

    expect(screen.getByText('Nueva Orden de Despacho')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ej. merchant-chile')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ej. Av. Providencia 1234, Santiago')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ej. Av. Apoquindo 5678, Las Condes')).toBeInTheDocument();
  });
});
