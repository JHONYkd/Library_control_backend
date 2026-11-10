import React, { useEffect, useState } from 'react';
import { Package, Plus, Pencil, Trash2, Loader } from 'lucide-react';
import { estoquesApi, livrosApi } from '../services/api';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const EMPTY = { livroId: '', quantidadeTotal: '', quantidadeDisponivel: '' };

export default function Estoque() {
  const toast = useToast();
  const [items,   setItems]   = useState([]);
  const [livros,  setLivros]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);

  const load = () => {
    setLoading(true);
    Promise.allSettled([estoquesApi.listar(), livrosApi.listar()]).then(([e, l]) => {
      if (e.status === 'fulfilled') setItems(e.value || []);
      if (l.status === 'fulfilled') setLivros(l.value || []);
      setLoading(false);
    });
  };
  useEffect(load, []);

  const openNew  = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (e) => { setForm({ livroId: e.livro?.id || '', quantidadeTotal: e.quantidadeTotal, quantidadeDisponivel: e.quantidadeDisponivel }); setEditId(e.id); setModal(true); };

  const save = async () => {
    if (!form.livroId || form.quantidadeTotal === '') return toast('Preencha os campos obrigatórios', 'error');
    setSaving(true);
    try {
      const payload = {
        livro: { id: Number(form.livroId) },
        quantidadeTotal:      Number(form.quantidadeTotal),
        quantidadeDisponivel: Number(form.quantidadeDisponivel || form.quantidadeTotal),
      };
      if (editId) { await estoquesApi.atualizar(editId, payload); toast('Atualizado', 'success'); }
      else        { await estoquesApi.salvar(payload);             toast('Cadastrado', 'success'); }
      setModal(false); load();
    } catch (e) { toast(e.message || 'Erro', 'error'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Excluir?')) return;
    try { await estoquesApi.deletar(id); toast('Excluído', 'success'); load(); }
    catch (e) { toast(e.message, 'error'); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-icon"><Package size={24} /></div>
        <div><h1>Estoque</h1><p>Controle de disponibilidade dos livros</p></div>
        <div className="page-header-actions">
          <button className="btn btn-gold" onClick={openNew}><Plus size={16} /> Novo Registro</button>
        </div>
      </div>

      <div className="card">
        {loading ? <div className="loading"><Loader size={20} className="spin" /></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Livro</th><th>Disponível</th><th>Total</th><th>Disponibilidade</th><th>Ações</th></tr></thead>
              <tbody>
                {items.length === 0
                  ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>Nenhum registro</td></tr>
                  : items.map(e => {
                    const p = e.quantidadeTotal ? Math.round((e.quantidadeDisponivel / e.quantidadeTotal) * 100) : 0;
                    const cor = p > 50 ? 'var(--success)' : p > 20 ? 'var(--warning)' : 'var(--danger)';
                    return (
                      <tr key={e.id}>
                        <td style={{ color: 'var(--muted)' }}>{e.id}</td>
                        <td><strong>{e.livro?.titulo || '—'}</strong></td>
                        <td><strong style={{ color: cor }}>{e.quantidadeDisponivel}</strong></td>
                        <td>{e.quantidadeTotal}</td>
                        <td style={{ minWidth: 130 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: '#e8eaf0', borderRadius: 4, overflow: 'hidden' }}>
                              <div style={{ width: `${p}%`, height: '100%', background: cor, borderRadius: 4 }} />
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--muted)', width: 34 }}>{p}%</span>
                          </div>
                        </td>
                        <td>
                          <div className="actions">
                            <button className="btn btn-info btn-sm" onClick={() => openEdit(e)}><Pencil size={13} /></button>
                            <button className="btn btn-danger btn-sm" onClick={() => remove(e.id)}><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <Modal title={editId ? 'Editar Estoque' : 'Novo Registro'} onClose={() => setModal(false)}
          footer={<>
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn btn-gold" onClick={save} disabled={saving}>
              {saving && <Loader size={14} className="spin" />} {editId ? 'Salvar' : 'Cadastrar'}
            </button>
          </>}>
          <div className="form-group"><label className="form-label">Livro *</label>
            <select className="form-select" value={form.livroId} onChange={e => setForm(f => ({ ...f, livroId: e.target.value }))}>
              <option value="">Selecione</option>{livros.map(l => <option key={l.id} value={l.id}>{l.titulo}</option>)}
            </select></div>
          <div className="form-group"><label className="form-label">Quantidade Total *</label>
            <input className="form-input" type="number" min="0" value={form.quantidadeTotal} onChange={e => setForm(f => ({ ...f, quantidadeTotal: e.target.value }))} placeholder="Ex: 10" /></div>
          <div className="form-group"><label className="form-label">Quantidade Disponível</label>
            <input className="form-input" type="number" min="0" value={form.quantidadeDisponivel} onChange={e => setForm(f => ({ ...f, quantidadeDisponivel: e.target.value }))} placeholder="Deixe em branco para igual ao total" /></div>
        </Modal>
      )}
    </div>
  );
}