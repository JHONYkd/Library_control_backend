package com.example.librarycontrol.repository;

import com.example.librarycontrol.Modelo.Livro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LivroRepository extends JpaRepository<Livro, Long> {
}
