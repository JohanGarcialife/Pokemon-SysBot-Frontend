'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Users, Eye, Activity, TrendingUp } from 'lucide-react';

const PLAN_DISPLAY_NAMES: Record<string, string> = {
  free: 'Gratis',
  gym: 'Líder de Gimnasio',
  elite: 'Alto Mando',
  champion: 'Campeón de Liga',
  premium: 'Premium'
};

const PLAN_COLORS: Record<string, string> = {
  free: 'from-gray-500 to-gray-600',
  gym: 'from-blue-500 to-blue-600',
  elite: 'from-purple-500 to-purple-600',
  champion: 'from-amber-400 to-amber-600',
  premium: 'from-rose-500 to-rose-600'
};

export default function AdminDashboard() {
  const { supabase } = useAppStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      try {
        const res = await fetch('/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching admin stats', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <>
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Dashboard</h1>
        <p className="text-gray-400 font-medium">Resumen de la plataforma y estadísticas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs">Total Usuarios</h3>
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="text-4xl font-black text-white">{stats.totalUsers || 0}</div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs">Trades (Hoy)</h3>
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="text-4xl font-black text-white">{stats.ordersToday || 0}</div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs">Trades (Semana)</h3>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="text-4xl font-black text-white">{stats.ordersThisWeek || 0}</div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs">Visitas (Hoy)</h3>
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Eye className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="text-4xl font-black text-white">{stats.pageViewsToday || 0}</div>
          <div className="text-xs text-gray-500 mt-2">Semana: {stats.pageViewsWeek || 0} · Total: {stats.pageViewsTotal || 0}</div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-white mb-6">Suscriptores por Tier</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(PLAN_DISPLAY_NAMES).map(([tier, name]) => {
            const count = stats.usersPerTier?.[tier] || 0;
            const gradient = PLAN_COLORS[tier] || PLAN_COLORS.free;
            
            return (
              <div key={tier} className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5 relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative z-10">
                  <h3 className="text-gray-400 font-bold text-sm mb-2">{name}</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-white">{count}</span>
                    <span className="text-gray-500 font-medium mb-1 text-sm">usuarios</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
