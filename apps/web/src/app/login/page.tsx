'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, ShieldCheck, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const [email, setEmail] = useState('admin@logipulse.ai');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push('/');
    }
  }, [auth.isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await auth.login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas');
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setError(null);

    let targetEmail = 'admin@logipulse.ai';
    let targetPassword = 'admin123';

    if (role === 'DISPATCHER') {
      targetEmail = 'dispatcher@logipulse.ai';
      targetPassword = 'dispatcher123';
    } else if (role === 'DRIVER') {
      targetEmail = 'driver@logipulse.ai';
      targetPassword = 'driver123';
    }

    setEmail(targetEmail);
    setPassword(targetPassword);

    try {
      await auth.login(targetEmail, targetPassword);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Error en inicio de sesión demo');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 bg-sky-600/20 border border-sky-500/30 text-sky-400 rounded-2xl flex items-center justify-center mb-4">
            <Truck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Iniciar Sesión en <span className="text-sky-400">LogiPulse AI</span>
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Plataforma SaaS de Telemetría & Diagnóstico Inteligente de Flotas
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl p-3.5 flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Acceso Rápido con 1-Click (Demo) */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block text-center">
            ⚡ Acceso Rápido Demo por Rol
          </label>

          <div className="grid grid-cols-1 gap-2.5">
            <button
              onClick={() => handleDemoLogin('ADMIN')}
              disabled={auth.isLoading}
              className="flex items-center justify-between bg-slate-800/80 hover:bg-slate-700/80 border border-indigo-500/30 text-slate-100 p-3 rounded-xl transition-all group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">👑</span>
                <div className="text-left">
                  <p className="text-xs font-bold text-indigo-300">Administrador (ADMIN)</p>
                  <p className="text-[10px] text-slate-400">admin@logipulse.ai | admin123</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => handleDemoLogin('DISPATCHER')}
              disabled={auth.isLoading}
              className="flex items-center justify-between bg-slate-800/80 hover:bg-slate-700/80 border border-sky-500/30 text-slate-100 p-3 rounded-xl transition-all group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">📋</span>
                <div className="text-left">
                  <p className="text-xs font-bold text-sky-300">Despachador (DISPATCHER)</p>
                  <p className="text-[10px] text-slate-400">dispatcher@logipulse.ai | dispatcher123</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => handleDemoLogin('DRIVER')}
              disabled={auth.isLoading}
              className="flex items-center justify-between bg-slate-800/80 hover:bg-slate-700/80 border border-emerald-500/30 text-slate-100 p-3 rounded-xl transition-all group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">🚛</span>
                <div className="text-left">
                  <p className="text-xs font-bold text-emerald-300">Conductor (DRIVER)</p>
                  <p className="text-[10px] text-slate-400">driver@logipulse.ai | driver123</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-slate-900 px-3 text-slate-500 font-medium">o ingresa credenciales</span>
          </div>
        </div>

        {/* Formulario Tradicional */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={auth.isLoading}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4" />
            <span>{auth.isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
