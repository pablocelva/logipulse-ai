'use client';

import React from 'react';
import { AiIncidentResponse, SeverityLevel } from '../types';
import { Cpu, AlertCircle, ShieldAlert, CheckCircle, Sparkles, RefreshCw } from 'lucide-react';

interface AiIncidentCardProps {
  diagnosis: AiIncidentResponse | null;
  onRunDemo: () => void;
  isLoading?: boolean;
}

export default function AiIncidentCard({ diagnosis, onRunDemo, isLoading }: AiIncidentCardProps) {
  const getSeverityStyle = (severity?: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-950/60 border-red-800 text-red-300',
          badge: 'bg-red-900 text-red-200 border-red-700',
          icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-950/60 border-amber-800 text-amber-300',
          badge: 'bg-amber-900 text-amber-200 border-amber-700',
          icon: <AlertCircle className="w-5 h-5 text-amber-400" />,
        };
      case 'MEDIUM':
        return {
          bg: 'bg-yellow-950/60 border-yellow-800 text-yellow-300',
          badge: 'bg-yellow-900 text-yellow-200 border-yellow-700',
          icon: <AlertCircle className="w-5 h-5 text-yellow-400" />,
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-950/60 border-emerald-800 text-emerald-300',
          badge: 'bg-emerald-900 text-emerald-200 border-emerald-700',
          icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
        };
    }
  };

  const style = getSeverityStyle(diagnosis?.severity);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-sky-950 border border-sky-800 rounded-lg text-sky-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-100 text-lg flex items-center gap-1.5">
                AI Incident Assistant
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-400">Diagnóstico Groq Cloud API + Tavily Search API</p>
            </div>
          </div>

          <button
            onClick={onRunDemo}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Ejecutar IA Demo
          </button>
        </div>

        {diagnosis ? (
          <div className={`p-4 rounded-xl border ${style.bg} space-y-3 transition-all`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {style.icon}
                <span className="font-bold text-sm">Diagnóstico de Incidente</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${style.badge}`}>
                SEVERIDAD: {diagnosis.severity}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Resumen del Incidente</h4>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">{diagnosis.summary}</p>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">Recomendación Operativa para Chofer</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{diagnosis.suggestedAction}</p>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-center text-slate-500">
            <Cpu className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-medium">No se han emitido alertas de tráfico recientemente.</p>
            <p className="text-xs text-slate-600 mt-1">
              Haz clic en &quot;Ejecutar IA Demo&quot; para simular un análisis de congestión vial.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span>Modelo Activo: <strong className="text-slate-300 font-mono">groq/compound-mini</strong></span>
        <span>Contexto: <strong className="text-emerald-400">Tavily Web Search Live</strong></span>
      </div>
    </div>
  );
}
