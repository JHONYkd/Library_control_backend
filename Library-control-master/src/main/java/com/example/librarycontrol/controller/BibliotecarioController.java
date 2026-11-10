package com.example.librarycontrol.controller;

import com.example.librarycontrol.Modelo.Bibliotecario;
import com.example.librarycontrol.service.BibliotecarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bibliotecarios")
@RequiredArgsConstructor
public class BibliotecarioController {

    private final BibliotecarioService service;

    @PostMapping
    public Bibliotecario salvar(@RequestBody Bibliotecario bibliotecario) {
        return service.salvar(bibliotecario);
    }

    @GetMapping
    public List<Bibliotecario> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Bibliotecario buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Bibliotecario atualizar(
            @PathVariable Long id,
            @RequestBody Bibliotecario atualizado
    ) {
        return service.atualizar(id, atualizado);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
