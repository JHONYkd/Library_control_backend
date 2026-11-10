import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { ToastProvider } from './components/Toast';
import Dashboard from './pages/Dashboard';
import Livros from './pages/Livros';
import Usuarios from './pages/Usuarios';
import Bibliotecarios from './pages/Bibliotecarios';
import Emprestimos from './pages/Emprestimos';
import Estoque from './pages/Estoque';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="layout">
          <Sidebar />
          <main className="main">
            <Routes>
              <Route path="/"                 element={<Dashboard />} />
              <Route path="/livros"           element={<Livros />} />
              <Route path="/usuarios"         element={<Usuarios />} />
              <Route path="/bibliotecarios"   element={<Bibliotecarios />} />
              <Route path="/emprestimos"      element={<Emprestimos />} />
              <Route path="/estoque"          element={<Estoque />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}