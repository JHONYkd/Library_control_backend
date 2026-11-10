import React, { useEffect, useState } from 'react';
import { LayoutDashboard, BookOpen, Users, Repeat2, Package, TrendingUp } from 'lucide-react';
import { livrosApi, usuariosApi, emprestimosApi, estoquesApi } from '../services/api';

export default function Dashboard() {
  const [livros,      setLivros]      = useState([]);
  const [usuarios,    setUsuarios]    = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);
  const [estoques,    setEstoques]    = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    Promise.allSettled([
      livrosApi.listar(),
      usuariosApi.listar(),
      emprestimosApi.listar(),
      estoquesApi.listar(),
    ]).then(([l, u, e, es]) => {
      if (l.status  === 'fulfilled') setLivros(l.value || []);
      if (u.status  === 'fulfilled') setUsuarios(u.value || []);
      if (e.status  === 'fulfilled') setEmprestimos(e.value || []);
      if (es.status === 'fulfilled') setEstoques(es.value || []);
      setLoading(false);
    });
  }, []);

  const emprestimosAtivos    = emprestimos.filter(e => e.status === 'APROVADO').length;
  const emprestimosPendentes = emprestimos.filter(e => e.status === 'PENDENTE');
  const disponiveis          = estoques.reduce((s, e) => s + (e.quantidadeDisponivel || 0), 0);
  const recenteLivros        = [...livros].reverse().slice(0, 5);

  const stats = [
    { label: 'Total de Livros',      value: livros.length,     icon: <BookOpen size={20} />, cls: 'blue'   },
    { label: 'Usuários Cadastrados', value: usuarios.length,   icon: <Users size={20} />,    cls: 'green'  },
    { label: 'Empréstimos Ativos',   value: emprestimosAtivos, icon: <Repeat2 size={20} />,  cls: 'orange' },
    { label: 'Livros Disponíveis',   value: disponiveis,       icon: <Package size={20} />,  cls: 'gold'   },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-icon"><LayoutDashboard size={24} /></div>
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral do sistema de biblioteca</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{loading ? '—' : s.value}</div>
            </div>
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card card-body">
          <div className="section-title">
            Empréstimos Pendentes
            <span className="badge badge-warning">{loading ? 0 : emprestimosPendentes.length}</span>
          </div>
          {loading ? <div className="empty-state">Carregando…</div>
          : emprestimosPendentes.length === 0 ? <div className="empty-state">Nenhum empréstimo pendente</div>
          : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Usuário</th><th>Livro</th><th>Data</th></tr></thead>
                <tbody>
                  {emprestimosPendentes.map(e => (
                    <tr key={e.id}>
                      <td>{e.usuario?.nome || '—'}</td>
                      <td>{e.livro?.titulo || '—'}</td>
                      <td>{e.dataEmprestimo || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card card-body">
          <div className="section-title">
            Últimos Livros
            <span style={{ marginLeft: 'auto' }}><TrendingUp size={16} style={{ color: 'var(--muted)' }} /></span>
          </div>
          {loading ? <div className="empty-state">Carregando…</div>
          : recenteLivros.length === 0 ? <div className="empty-state">Nenhum livro cadastrado</div>
          : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Título</th><th>Autor</th><th>Ano</th></tr></thead>
                <tbody>
                  {recenteLivros.map(l => (
                    <tr key={l.id}>
                      <td>{l.titulo}</td>
                      <td>{l.autor}</td>
                      <td>{l.anoPublicacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}