package com.example.librarycontrol.service;

import com.example.librarycontrol.Modelo.Usuario;
import com.example.librarycontrol.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;

    public Usuario salvar(Usuario usuario) {
        return repository.save(usuario);
    }

    public List<Usuario> listar() {
        return repository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + id));
    }

    public Usuario atualizar(Long id, Usuario atualizado) {
        Usuario usuario = buscarPorId(id);

        usuario.setNome(atualizado.getNome());
        usuario.setEmail(atualizado.getEmail());
        usuario.setTelefone(atualizado.getTelefone());

        return repository.save(usuario);
    }

    public void deletar(Long id) {
        buscarPorId(id); // valida existência antes de deletar
        repository.deleteById(id);
    }
}