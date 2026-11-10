const BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8080').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Erro ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const livrosApi = {
  listar:   ()        => request('/livros'),
  buscar:   (id)      => request(`/livros/${id}`),
  salvar:   (livro)   => request('/livros', { method: 'POST', body: JSON.stringify(livro) }),
  atualizar:(id, l)   => request(`/livros/${id}`, { method: 'PUT', body: JSON.stringify(l) }),
  deletar:  (id)      => request(`/livros/${id}`, { method: 'DELETE' }),
};

export const usuariosApi = {
  listar:   ()      => request('/usuarios'),
  buscar:   (id)    => request(`/usuarios/${id}`),
  salvar:   (u)     => request('/usuarios', { method: 'POST', body: JSON.stringify(u) }),
  atualizar:(id, u) => request(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(u) }),
  deletar:  (id)    => request(`/usuarios/${id}`, { method: 'DELETE' }),
};

export const bibliotecariosApi = {
  listar:   ()      => request('/bibliotecarios'),
  buscar:   (id)    => request(`/bibliotecarios/${id}`),
  salvar:   (b)     => request('/bibliotecarios', { method: 'POST', body: JSON.stringify(b) }),
  atualizar:(id, b) => request(`/bibliotecarios/${id}`, { method: 'PUT', body: JSON.stringify(b) }),
  deletar:  (id)    => request(`/bibliotecarios/${id}`, { method: 'DELETE' }),
};

export const emprestimosApi = {
  listar:   ()      => request('/emprestimos'),
  buscar:   (id)    => request(`/emprestimos/${id}`),
  solicitar:(e)     => request('/emprestimos', { method: 'POST', body: JSON.stringify(e) }),
  aprovar:  (id)    => request(`/emprestimos/${id}/aprovar`, { method: 'PUT' }),
  devolver: (id)    => request(`/emprestimos/${id}/devolver`, { method: 'PUT' }),
  deletar:  (id)    => request(`/emprestimos/${id}`, { method: 'DELETE' }),
};

export const estoquesApi = {
  listar:   ()      => request('/estoques'),
  buscar:   (id)    => request(`/estoques/${id}`),
  salvar:   (e)     => request('/estoques', { method: 'POST', body: JSON.stringify(e) }),
  atualizar:(id, e) => request(`/estoques/${id}`, { method: 'PUT', body: JSON.stringify(e) }),
  deletar:  (id)    => request(`/estoques/${id}`, { method: 'DELETE' }),
};