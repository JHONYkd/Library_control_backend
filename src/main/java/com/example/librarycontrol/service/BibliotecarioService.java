package com.example.librarycontrol.service;

import com.example.librarycontrol.Modelo.Bibliotecario;
import com.example.librarycontrol.repository.BibliotecarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BibliotecarioService {

    private final BibliotecarioRepository repository;

    public Bibliotecario salvar(Bibliotecario bibliotecario) {
        return repository.save(bibliotecario);
    }

    public List<Bibliotecario> listar() {
        return repository.findAll();
    }

    public Bibliotecario buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bibliotecário não encontrado: " + id));
    }

    public Bibliotecario atualizar(Long id, Bibliotecario atualizado) {
        Bibliotecario bibliotecario = buscarPorId(id);

        bibliotecario.setNome(atualizado.getNome());
        bibliotecario.setEmail(atualizado.getEmail());
        bibliotecario.setSenha(atualizado.getSenha());

        return repository.save(bibliotecario);
    }

    public void deletar(Long id) {
        buscarPorId(id); // valida existência antes de deletar
        repository.deleteById(id);
    }
}