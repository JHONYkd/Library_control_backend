package com.example.librarycontrol.repository;

import com.example.librarycontrol.Modelo.Bibliotecario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BibliotecarioRepository extends JpaRepository<Bibliotecario, Long> {
}
