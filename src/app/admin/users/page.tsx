'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Search, Filter, Edit2, X, Check } from 'lucide-react';

const PLAN_DISPLAY_NAMES: Record<string, string> = {
  free: 'Gratis',
  gym: 'Líder de Gimnasio',
  elite: 'Alto Mando',
  champion: 'Campeón de Liga',
  premium: 'Premium'
};

const TIERS = ['free', 'gym', 'elite', 'champion', 'premium'];

export default function UsersManagement() {
  const { supabase } = useAppStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newTier, setNewTier] = useState('free');
  const [reason, setReason] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchUsers = async () => {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: '20'
      });
      if (search) params.append('search', search);
      if (tierFilter) params.append('tier', tierFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, tierFilter, supabase]);

  const handleUpdateTier = async () => {
    if (!selectedUser || !supabase) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}/tier`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ tier: newTier, reason })
      });

      if (res.ok) {
        setSelectedUser(null);
        setReason('');
        fetchUsers();
      }
    } catch (err) {
      console.error('Error updating tier', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-400 font-medium">Administra los usuarios y sus planes</p>
        </div>
      </div>

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="p-4 border-b border-gray-700/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              value={tierFilter}
              onChange={(e) => { setTierFilter(e.target.value); setPage(1); }}
              className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-2.5 appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            >
              <option value="">Todos los planes</option>
              {TIERS.map(t => (
                <option key={t} value={t}>{PLAN_DISPLAY_NAMES[t]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 border-b border-gray-700/50">
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Plan</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Registro</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">No se encontraron usuarios.</td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-700/20 transition-colors">
                    <td className="p-4 font-medium text-white">{u.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                        u.plan === 'free' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                        u.plan === 'gym' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        u.plan === 'elite' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        u.plan === 'champion' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {PLAN_DISPLAY_NAMES[u.plan] || u.plan}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(u.created_at || u.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setNewTier(u.plan || 'free');
                          setReason('');
                        }}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        title="Cambiar Tier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
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

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
              <h3 className="text-xl font-bold text-white">Cambiar Plan</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Usuario</label>
                <div className="text-white font-medium bg-gray-950 rounded-lg p-3 border border-gray-800">{selectedUser.email}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nuevo Plan</label>
                <select
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-medium"
                >
                  {TIERS.map(t => (
                    <option key={t} value={t}>{PLAN_DISPLAY_NAMES[t]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Motivo (Opcional)</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Razón del cambio manual..."
                  className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none h-24"
                />
              </div>
            </div>

            <div className="p-5 border-t border-gray-800 bg-gray-800/30 flex gap-3 justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateTier}
                disabled={updating || selectedUser.plan === newTier}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
              >
                {updating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Confirmar Cambio
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
