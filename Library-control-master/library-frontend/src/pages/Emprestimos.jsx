import React, { useEffect, useState } from 'react';
import { Repeat2, Plus, Check, RotateCcw, Trash2, Loader } from 'lucide-react';
import { emprestimosApi, livrosApi, usuariosApi, bibliotecariosApi } from '../services/api';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const EMPTY = { usuarioId: '', livroId: '', bibliotecarioId: '', dataEmprestimo: '', dataDevolucao: '' };

export default function Emprestimos() {
  const toast = useToast();
  const [items,    setItems]    = useState([]);
  const [livros,   setLivros]   = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [bibls,    setBibls]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY);

  const load = () => {
    setLoading(true);
    Promise.allSettled([
      emprestimosApi.listar(), livrosApi.listar(),
      usuariosApi.listar(), bibliotecariosApi.listar(),
    ]).then(([e, l, u, b]) => {
      if (e.status === 'fulfilled') setItems(e.value || []);
      if (l.status === 'fulfilled') setLivros(l.value || []);
      if (u.status === 'fulfilled') setUsuarios(u.value || []);
      if (b.status === 'fulfilled') setBibls(b.value || []);
      setLoading(false);
    });
  };
  useEffect(load, []);

  const solicitar = async () => {
    if (!form.usuarioId || !form.livroId || !form.bibliotecarioId)
      return toast('Selecione usuário, livro e bibliotecário', 'error');
    setSaving(true);
    try {
      await emprestimosApi.solicitar({
        usuario:       { id: Number(form.usuarioId) },
        livro:         { id: Number(form.livroId) },
        bibliotecario: { id: Number(form.bibliotecarioId) },
        dataEmprestimo: form.dataEmprestimo || null,
        dataDevolucao:  form.dataDevolucao  || null,
      });
      toast('Empréstimo solicitado', 'success');
      setModal(false); load();
    } catch (e) { toast(e.message || 'Erro', 'error'); }
    finally { setSaving(false); }
  };

  const aprovar  = async (id) => { try { await emprestimosApi.aprovar(id);  toast('Aprovado', 'success'); load(); } catch (e) { toast(e.message, 'error'); } };
  const devolver = async (id) => { try { await emprestimosApi.devolver(id); toast('Devolvido', 'success'); load(); } catch (e) { toast(e.message, 'error'); } };
  const remove   = async (id) => {
    if (!window.confirm('Excluir?')) return;
    try { await emprestimosApi.deletar(id); toast('Excluído', 'success'); load(); } catch (e) { toast(e.message, 'error'); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-icon"><Repeat2 size={24} /></div>
        <div><h1>Empréstimos</h1><p>Gerencie os empréstimos da biblioteca</p></div>
        <div className="page-header-actions">
          <button className="btn btn-gold" onClick={() => { setForm(EMPTY); setModal(true); }}><Plus size={16} /> Novo Empréstimo</button>
        </div>
      </div>

      <div className="card">
        {loading ? <div className="loading"><Loader size={20} className="spin" /></div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Usuário</th><th>Livro</th><th>Bibliotecário</th><th>Empréstimo</th><th>Devolução</th><th>Status</th><th>Ações</th></tr>
              </thead>
              <tbody>
                {items.length === 0
                  ? <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>Nenhum empréstimo</td></tr>
                  : items.map(e => (
                    <tr key={e.id}>
                      <td style={{ color: 'var(--muted)' }}>{e.id}</td>
                      <td>{e.usuario?.nome || '—'}</td>
                      <td>{e.livro?.titulo || '—'}</td>
                      <td>{e.bibliotecario?.nome || '—'}</td>
                      <td>{e.dataEmprestimo || '—'}</td>
                      <td>{e.dataDevolucao  || '—'}</td>
                      <td><span className={`status status-${e.status}`}>{e.status}</span></td>
                      <td>
                        <div className="actions">
                          {e.status === 'PENDENTE'  && <button className="btn btn-success btn-sm" title="Aprovar"  onClick={() => aprovar(e.id)}><Check size={13} /></button>}
                          {e.status === 'APROVADO'  && <button className="btn btn-info btn-sm"    title="Devolver" onClick={() => devolver(e.id)}><RotateCcw size={13} /></button>}
                          <button className="btn btn-danger btn-sm" onClick={() => remove(e.id)}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <Modal title="Novo Empréstimo" onClose={() => setModal(false)}
          footer={<>
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn btn-gold" onClick={solicitar} disabled={saving}>
              {saving && <Loader size={14} className="spin" />} Solicitar
            </button>
          </>}>
          <div className="form-group"><label className="form-label">Usuário *</label>
            <select className="form-select" value={form.usuarioId} onChange={e => setForm(f => ({ ...f, usuarioId: e.target.value }))}>
              <option value="">Selecione</option>{usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
            </select></div>
          <div className="form-group"><label className="form-label">Livro *</label>
            <select className="form-select" value={form.livroId} onChange={e => setForm(f => ({ ...f, livroId: e.target.value }))}>
              <option value="">Selecione</option>{livros.map(l => <option key={l.id} value={l.id}>{l.titulo}</option>)}
            </select></div>
          <div className="form-group"><label className="form-label">Bibliotecário *</label>
            <select className="form-select" value={form.bibliotecarioId} onChange={e => setForm(f => ({ ...f, bibliotecarioId: e.target.value }))}>
              <option value="">Selecione</option>{bibls.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
            </select></div>
          <div className="form-group"><label className="form-label">Data do Empréstimo</label>
            <input className="form-input" type="date" value={form.dataEmprestimo} onChange={e => setForm(f => ({ ...f, dataEmprestimo: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Prazo de Devolução</label>
            <input className="form-input" type="date" value={form.dataDevolucao} onChange={e => setForm(f => ({ ...f, dataDevolucao: e.target.value }))} /></div>
        </Modal>
      )}
    </div>
  );
}