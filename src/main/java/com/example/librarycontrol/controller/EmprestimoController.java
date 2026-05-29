package com.example.librarycontrol.controller;

import com.example.librarycontrol.Modelo.Emprestimo;
import com.example.librarycontrol.service.EmprestimoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emprestimos")
@RequiredArgsConstructor
public class EmprestimoController {

    private final EmprestimoService service;

    @PostMapping
    public Emprestimo solicitar(@RequestBody Emprestimo emprestimo) {
        return service.solicitar(emprestimo);
    }

    @GetMapping
    public List<Emprestimo> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Emprestimo buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}/aprovar")
    public Emprestimo aprovar(@PathVariable Long id) {
        return service.aprovar(id);
    }

    @PutMapping("/{id}/devolver")
    public Emprestimo devolver(@PathVariable Long id) {
        return service.devolver(id);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
