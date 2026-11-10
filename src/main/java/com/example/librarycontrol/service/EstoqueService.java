package com.example.librarycontrol.service;

import com.example.librarycontrol.Modelo.Estoque;
import com.example.librarycontrol.repository.EstoqueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EstoqueService {

    private final EstoqueRepository repository;

    public Estoque salvar(Estoque estoque) {
        return repository.save(estoque);
    }

    public List<Estoque> listar() {
        return repository.findAll();
    }

    public Estoque buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estoque não encontrado: " + id));
    }

    public Estoque atualizar(Long id, Estoque atualizado) {
        Estoque estoque = buscarPorId(id);

        estoque.setLivro(atualizado.getLivro());
        estoque.setQuantidadeDisponivel(atualizado.getQuantidadeDisponivel());
        estoque.setQuantidadeTotal(atualizado.getQuantidadeTotal());

        return repository.save(estoque);
    }

    public void deletar(Long id) {
        buscarPorId(id); // valida existência antes de deletar
        repository.deleteById(id);
    }
}