package com.example.librarycontrol.service;

import com.example.librarycontrol.Modelo.Livro;
import com.example.librarycontrol.repository.LivroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LivroService {

    private final LivroRepository repository;

    public Livro salvar(Livro livro) {
        return repository.save(livro);
    }

    public List<Livro> listar() {
        return repository.findAll();
    }

    public Livro buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado: " + id));
    }

    public Livro atualizar(Long id, Livro atualizado) {
        Livro livro = buscarPorId(id);

        livro.setTitulo(atualizado.getTitulo());
        livro.setAutor(atualizado.getAutor());
        livro.setIsbn(atualizado.getIsbn());
        livro.setAnoPublicacao(atualizado.getAnoPublicacao());

        return repository.save(livro);
    }

    public void deletar(Long id) {
        buscarPorId(id); // valida existência antes de deletar
        repository.deleteById(id);
    }
}