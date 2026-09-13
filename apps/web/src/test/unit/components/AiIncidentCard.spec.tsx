import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AiIncidentCard from '../../../components/AiIncidentCard';
import { AiIncidentResponse } from '../../../types';

describe('AiIncidentCard Component', () => {
  it('debe renderizar estado vacio cuando no hay diagnostico', () => {
    render(<AiIncidentCard diagnosis={null} onRunDemo={jest.fn()} />);

    expect(screen.getByText('AI Incident Assistant')).toBeInTheDocument();
    expect(
      screen.getByText('No se han emitido alertas de tráfico recientemente.')
    ).toBeInTheDocument();
  });

  it('debe renderizar el diagnostico de IA con la severidad correspondiente', () => {
    const mockDiagnosis: AiIncidentResponse = {
      severity: 'HIGH',
      summary: 'Accidente grave bloqueando 2 carriles.',
      suggestedAction: 'Tomar desvío por calle alternativa.',
    };

    render(<AiIncidentCard diagnosis={mockDiagnosis} onRunDemo={jest.fn()} />);

    expect(screen.getByText('SEVERIDAD: HIGH')).toBeInTheDocument();
    expect(screen.getByText('Accidente grave bloqueando 2 carriles.')).toBeInTheDocument();
    expect(screen.getByText('Tomar desvío por calle alternativa.')).toBeInTheDocument();
  });

  it('debe llamar a onRunDemo al pulsar Ejecutar IA Demo', () => {
    const onRunDemo = jest.fn();
    render(<AiIncidentCard diagnosis={null} onRunDemo={onRunDemo} />);

    const button = screen.getByText('Ejecutar IA Demo');
    fireEvent.click(button);

    expect(onRunDemo).toHaveBeenCalledTimes(1);
  });
});
