import React, { useEffect, useState } from 'react';
import { UserCog, Plus, Pencil, Trash2, Loader } from 'lucide-react';
import { bibliotecariosApi } from '../services/api';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const EMPTY = { nome: '', email: '', senha: '' };

export default function Bibliotecarios() {
  const toast = useToast();
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);

  const load = () => {
    setLoading(true);
    bibliotecariosApi.listar().then(setItems).catch(() => toast('Erro ao carregar', 'error')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (b) => { setForm({ nome: b.nome, email: b.email, senha: '' }); setEditId(b.id); setModal(true); };

  const save = async () => {
    if (!form.nome || !form.email) return toast('Preencha nome e e-mail', 'error');
    if (!editId && !form.senha)    return toast('Senha obrigatória', 'error');
    setSaving(true);
    try {
      const payload = editId && !form.senha ? { nome: form.nome, email: form.email } : form;
      if (editId) { await bibliotecariosApi.atualizar(editId, payload); toast('Atualizado', 'success'); }
      else        { await bibliotecariosApi.salvar(payload);             toast('Cadastrado', 'success'); }
      setModal(false); load();
    } catch (e) { toast(e.message || 'Erro', 'error'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Excluir este bibliotecário?')) return;
    try { await bibliotecariosApi.deletar(id); toast('Excluído', 'success'); load(); }
    catch (e) { toast(e.message || 'Erro', 'error'); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-icon"><UserCog size={24} /></div>
        <div><h1>Bibliotecários</h1><p>Gerencie os bibliotecários do sistema</p></div>
        <div className="page-header-actions">
          <button className="btn btn-gold" onClick={openNew}><Plus size={16} /> Novo Bibliotecário</button>
        </div>
      </div>

      <div className="card">
        {loading ? <div className="loading"><Loader size={20} className="spin" /></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Nome</th><th>E-mail</th><th>Ações</th></tr></thead>
              <tbody>
                {items.length === 0
                  ? <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>Nenhum bibliotecário cadastrado</td></tr>
                  : items.map(b => (
                    <tr key={b.id}>
                      <td style={{ color: 'var(--muted)' }}>{b.id}</td>
                      <td><strong>{b.nome}</strong></td>
                      <td>{b.email}</td>
                      <td>
                        <div className="actions">
                          <button className="btn btn-info btn-sm" onClick={() => openEdit(b)}><Pencil size={13} /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => remove(b.id)}><Trash2 size={13} /></button>
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
        <Modal title={editId ? 'Editar Bibliotecário' : 'Novo Bibliotecário'} onClose={() => setModal(false)}
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
          <div className="form-group"><label className="form-label">{editId ? 'Nova Senha (opcional)' : 'Senha *'}</label>
            <input className="form-input" type="password" value={form.senha} onChange={e => setForm(f => ({ ...f, senha: e.target.value }))} placeholder="••••••••" /></div>
        </Modal>
      )}
    </div>
  );
}