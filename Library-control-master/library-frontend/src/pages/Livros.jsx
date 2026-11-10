import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Pencil, Trash2, Loader } from 'lucide-react';
import { livrosApi } from '../services/api';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const EMPTY = { titulo: '', autor: '', isbn: '', anoPublicacao: '' };

export default function Livros() {
  const toast = useToast();
  const [livros,  setLivros]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);

  const load = () => {
    setLoading(true);
    livrosApi.listar().then(setLivros).catch(() => toast('Erro ao carregar', 'error')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (l) => { setForm({ titulo: l.titulo, autor: l.autor, isbn: l.isbn, anoPublicacao: l.anoPublicacao }); setEditId(l.id); setModal(true); };

  const save = async () => {
    if (!form.titulo || !form.autor) return toast('Preencha título e autor', 'error');
    setSaving(true);
    try {
      const payload = { ...form, anoPublicacao: form.anoPublicacao ? Number(form.anoPublicacao) : null };
      if (editId) { await livrosApi.atualizar(editId, payload); toast('Livro atualizado', 'success'); }
      else        { await livrosApi.salvar(payload);            toast('Livro cadastrado', 'success'); }
      setModal(false); load();
    } catch (e) { toast(e.message || 'Erro ao salvar', 'error'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Excluir este livro?')) return;
    try { await livrosApi.deletar(id); toast('Excluído', 'success'); load(); }
    catch (e) { toast(e.message || 'Erro', 'error'); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-icon"><BookOpen size={24} /></div>
        <div><h1>Livros</h1><p>Gerencie o acervo da biblioteca</p></div>
        <div className="page-header-actions">
          <button className="btn btn-gold" onClick={openNew}><Plus size={16} /> Novo Livro</button>
        </div>
      </div>

      <div className="card">
        {loading ? <div className="loading"><Loader size={20} className="spin" /></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Título</th><th>Autor</th><th>ISBN</th><th>Ano</th><th>Ações</th></tr></thead>
              <tbody>
                {livros.length === 0
                  ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>Nenhum livro cadastrado</td></tr>
                  : livros.map(l => (
                    <tr key={l.id}>
                      <td style={{ color: 'var(--muted)' }}>{l.id}</td>
                      <td><strong>{l.titulo}</strong></td>
                      <td>{l.autor}</td>
                      <td>{l.isbn || '—'}</td>
                      <td>{l.anoPublicacao || '—'}</td>
                      <td>
                        <div className="actions">
                          <button className="btn btn-info btn-sm" onClick={() => openEdit(l)}><Pencil size={13} /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => remove(l.id)}><Trash2 size={13} /></button>
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
        <Modal title={editId ? 'Editar Livro' : 'Novo Livro'} onClose={() => setModal(false)}
          footer={<>
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn btn-gold" onClick={save} disabled={saving}>
              {saving && <Loader size={14} className="spin" />} {editId ? 'Salvar' : 'Cadastrar'}
            </button>
          </>}>
          <div className="form-group"><label className="form-label">Título *</label>
            <input className="form-input" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Título do livro" /></div>
          <div className="form-group"><label className="form-label">Autor *</label>
            <input className="form-input" value={form.autor} onChange={e => setForm(f => ({ ...f, autor: e.target.value }))} placeholder="Nome do autor" /></div>
          <div className="form-group"><label className="form-label">ISBN</label>
            <input className="form-input" value={form.isbn} onChange={e => setForm(f => ({ ...f, isbn: e.target.value }))} placeholder="ISBN" /></div>
          <div className="form-group"><label className="form-label">Ano de Publicação</label>
            <input className="form-input" type="number" value={form.anoPublicacao} onChange={e => setForm(f => ({ ...f, anoPublicacao: e.target.value }))} placeholder="Ex: 2023" /></div>
        </Modal>
      )}
    </div>
  );
}