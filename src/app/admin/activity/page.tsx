'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ArrowRight, History } from 'lucide-react';

const PLAN_DISPLAY_NAMES: Record<string, string> = {
  free: 'Gratis',
  gym: 'Líder de Gimnasio',
  elite: 'Alto Mando',
  champion: 'Campeón de Liga',
  premium: 'Premium'
};

export default function ActivityLog() {
  const { supabase } = useAppStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchLogs() {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/admin/activity-log?page=${page}&perPage=20`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error('Error fetching logs', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [page, supabase]);

  const getTierBadge = (tier: string) => {
    if (!tier) return null;
    const isSpecial = tier !== 'free';
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
        isSpecial ? 'bg-indigo-500/20 text-indigo-300' : 'bg-gray-700 text-gray-300'
      }`}>
        {PLAN_DISPLAY_NAMES[tier] || tier}
      </span>
    );
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Registro de Actividad</h1>
        <p className="text-gray-400 font-medium">Historial de cambios y acciones administrativas</p>
      </div>

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 border-b border-gray-700/50">
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-40">Fecha</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Admin</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Usuario Afectado</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Acción / Cambio</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Motivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">No hay registros de actividad recientes.</p>
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-700/20 transition-colors">
                    <td className="p-4 text-sm text-gray-400 font-medium">
                      {new Date(log.created_at).toLocaleString('es-ES', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4 text-sm text-gray-300 font-medium">
                      {log.admin_email || 'Sistema'}
                    </td>
                    <td className="p-4 text-sm text-white font-medium">
                      {log.user_email || 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getTierBadge(log.old_tier)}
                        <ArrowRight className="w-3 h-3 text-gray-500" />
                        {getTierBadge(log.new_tier)}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-400 italic">
                      {log.reason || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-700/50 flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-bold text-white bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
              Anterior
            </button>
            <span className="text-sm font-medium text-gray-400">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-bold text-white bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </>
  );
}
