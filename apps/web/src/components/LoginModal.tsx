'use client';

import React, { useState } from 'react';
import { useAuth, UserRole } from '../context/AuthContext';

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('admin@logipulse.ai');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    const targetEmail = customEmail || email;
    const targetPassword = customPassword || password;

    try {
      await auth.login(targetEmail, targetPassword);
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (role: UserRole) => {
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

    await handleLogin(undefined, targetEmail, targetPassword);
  };

  return (
    <div className="relative">
      {auth.user ? (
        <div className="flex items-center space-x-3 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-lg px-3 py-1.5 shadow-sm">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-200">{auth.user.name}</span>
            <span className="text-[10px] font-mono text-emerald-400">{auth.user.email}</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded">
            {auth.user.role}
          </span>
          <button
            onClick={() => auth.logout()}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors font-medium ml-1"
          >
            Salir
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-sm transition-all flex items-center space-x-1.5"
        >
          <span>Iniciar Sesión</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl text-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <span>🔐 Autenticación</span>
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Inicia sesión con cuentas demo preconfiguradas o ingresa credenciales personalizadas.
            </p>

            {error && (
              <div className="bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-md p-2.5 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={(e) => handleLogin(e)} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 rounded-lg shadow-sm transition-all"
              >
                {loading ? 'Ingresando...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">⚡ Acceso Rápido con 1-Click (Cuentas Demo):</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoClick('ADMIN')}
                  className="bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] py-1.5 px-2 rounded font-medium border border-slate-700 transition-colors"
                >
                  👑 ADMIN
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoClick('DISPATCHER')}
                  className="bg-slate-800 hover:bg-slate-700 text-sky-300 text-[11px] py-1.5 px-2 rounded font-medium border border-slate-700 transition-colors"
                >
                  📋 DISPATCHER
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoClick('DRIVER')}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] py-1.5 px-2 rounded font-medium border border-slate-700 transition-colors"
                >
                  🚚 DRIVER
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
