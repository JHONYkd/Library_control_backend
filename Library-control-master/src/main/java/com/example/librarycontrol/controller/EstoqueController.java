package com.example.librarycontrol.controller;

import com.example.librarycontrol.Modelo.Estoque;
import com.example.librarycontrol.service.EstoqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/estoques")
@RequiredArgsConstructor
public class EstoqueController {

    private final EstoqueService service;

    @PostMapping
    public Estoque salvar(@RequestBody Estoque estoque) {
        return service.salvar(estoque);
    }

    @GetMapping
    public List<Estoque> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Estoque buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Estoque atualizar(
            @PathVariable Long id,
            @RequestBody Estoque atualizado
    ) {
        return service.atualizar(id, atualizado);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
