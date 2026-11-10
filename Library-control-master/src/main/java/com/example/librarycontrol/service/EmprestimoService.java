package com.example.librarycontrol.service;

import com.example.librarycontrol.Modelo.Emprestimo;
import com.example.librarycontrol.Modelo.Estoque;
import com.example.librarycontrol.Modelo.StatusEmprestimo;
import com.example.librarycontrol.repository.EmprestimoRepository;
import com.example.librarycontrol.repository.EstoqueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmprestimoService {

    private final EmprestimoRepository emprestimoRepository;
    private final EstoqueRepository estoqueRepository;

    public Emprestimo solicitar(Emprestimo emprestimo) {
        Estoque estoque = estoqueRepository
                .findAll()
                .stream()
                .filter(e -> e.getLivro().getId()
                        .equals(emprestimo.getLivro().getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Estoque não encontrado para o livro"));

        if (estoque.getQuantidadeDisponivel() <= 0) {
            throw new RuntimeException("Livro indisponível");
        }

        emprestimo.setStatus(StatusEmprestimo.PENDENTE);
        return emprestimoRepository.save(emprestimo);
    }

    public Emprestimo aprovar(Long id) {
        Emprestimo emprestimo = emprestimoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado: " + id));

        Estoque estoque = estoqueRepository
                .findAll()
                .stream()
                .filter(e -> e.getLivro().getId()
                        .equals(emprestimo.getLivro().getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Estoque não encontrado para o livro"));

        estoque.setQuantidadeDisponivel(estoque.getQuantidadeDisponivel() - 1);
        estoqueRepository.save(estoque);

        emprestimo.setStatus(StatusEmprestimo.APROVADO);
        return emprestimoRepository.save(emprestimo);
    }

    public Emprestimo devolver(Long id) {
        Emprestimo emprestimo = emprestimoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado: " + id));

        Estoque estoque = estoqueRepository
                .findAll()
                .stream()
                .filter(e -> e.getLivro().getId()
                        .equals(emprestimo.getLivro().getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Estoque não encontrado para o livro"));

        estoque.setQuantidadeDisponivel(estoque.getQuantidadeDisponivel() + 1);
        estoqueRepository.save(estoque);

        emprestimo.setStatus(StatusEmprestimo.DEVOLVIDO);
        return emprestimoRepository.save(emprestimo);
    }

    // ✅ Adicionados abaixo

    public List<Emprestimo> listar() {
        return emprestimoRepository.findAll();
    }

    public Emprestimo buscarPorId(Long id) {
        return emprestimoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado: " + id));
    }

    public void deletar(Long id) {
        emprestimoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado: " + id));
        emprestimoRepository.deleteById(id);
    }
}