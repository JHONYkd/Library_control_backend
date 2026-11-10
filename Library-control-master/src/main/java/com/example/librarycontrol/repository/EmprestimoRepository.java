package com.example.librarycontrol.repository;

import com.example.librarycontrol.Modelo.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {
}
