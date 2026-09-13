import './globals.css';
import React from 'react';
import { Truck, Cpu, Radio } from 'lucide-react';

export const metadata = {
  title: 'LogiPulse AI - Dashboard Logístico y Telemetría en Tiempo Real',
  description: 'SaaS de Gestión Logística con IA e Inferencia Groq API + Tavily Search',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased flex flex-col min-h-screen">
        <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sky-600 rounded-lg text-white">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-sky-400 bg-clip-text text-transparent">
                  LogiPulse <span className="text-sky-400 font-extrabold">AI</span>
                </h1>
                <p className="text-xs text-slate-400">Plataforma SaaS de Telemetría & Diagnóstico Inteligente</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-slate-300">WebSockets Activo</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-medium text-slate-300">Groq LLM + Tavily</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-4 text-center">
          LogiPulse AI © 2026 - Microservicios Hexagonales en NestJS, Next.js 14+, PostgreSQL, MongoDB, RabbitMQ y Groq Cloud API.
        </footer>
      </body>
    </html>
  );
}
