import React, { useEffect, useState } from 'react';
import { Users, Plus, Pencil, Trash2, Loader } from 'lucide-react';
import { usuariosApi } from '../services/api';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const EMPTY = { nome: '', email: '', telefone: '' };

export default function Usuarios() {
  const toast = useToast();
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);

  const load = () => {
    setLoading(true);
    usuariosApi.listar().then(setItems).catch(() => toast('Erro ao carregar', 'error')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (u) => { setForm({ nome: u.nome, email: u.email, telefone: u.telefone }); setEditId(u.id); setModal(true); };

  const save = async () => {
    if (!form.nome || !form.email) return toast('Preencha nome e e-mail', 'error');
    setSaving(true);
    try {
      if (editId) { await usuariosApi.atualizar(editId, form); toast('Usuário atualizado', 'success'); }
      else        { await usuariosApi.salvar(form);            toast('Usuário cadastrado', 'success'); }
      setModal(false); load();
    } catch (e) { toast(e.message || 'Erro', 'error'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Excluir este usuário?')) return;
    try { await usuariosApi.deletar(id); toast('Excluído', 'success'); load(); }
    catch (e) { toast(e.message || 'Erro', 'error'); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-icon"><Users size={24} /></div>
        <div><h1>Usuários</h1><p>Gerencie os usuários da biblioteca</p></div>
        <div className="page-header-actions">
          <button className="btn btn-gold" onClick={openNew}><Plus size={16} /> Novo Usuário</button>
        </div>
      </div>

      <div className="card">
        {loading ? <div className="loading"><Loader size={20} className="spin" /></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Nome</th><th>E-mail</th><th>Telefone</th><th>Ações</th></tr></thead>
              <tbody>
                {items.length === 0
                  ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>Nenhum usuário cadastrado</td></tr>
                  : items.map(u => (
                    <tr key={u.id}>
                      <td style={{ color: 'var(--muted)' }}>{u.id}</td>
                      <td><strong>{u.nome}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.telefone || '—'}</td>
                      <td>
                        <div className="actions">
                          <button className="btn btn-info btn-sm" onClick={() => openEdit(u)}><Pencil size={13} /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => remove(u.id)}><Trash2 size={13} /></button>
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
        <Modal title={editId ? 'Editar Usuário' : 'Novo Usuário'} onClose={() => setModal(false)}
          footer={<>
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn btn-gold" onClick={save} disabled={saving}>
              {saving && <Loader size={14} className="spin" />} {editId ? 'Salvar' : 'Cadastrar'}
            </button>
          </>}>
          <div className="form-group"><label className="form-label">Nome *</label>
            <input className="form-input" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome completo" /></div>
          <div className="form-group"><label className="form-label">E-mail *</label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@exemplo.com" /></div>
          <div className="form-group"><label className="form-label">Telefone</label>
            <input className="form-input" value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} placeholder="(xx) xxxxx-xxxx" /></div>
        </Modal>
      )}
    </div>
  );
}