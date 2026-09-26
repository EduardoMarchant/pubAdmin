package com.pubadmin.repository;

import com.pubadmin.entity.Integrante;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IntegranteRepository extends JpaRepository<Integrante, Long> {

    boolean existsByRut(String rut);

    boolean existsByRutAndIdNot(String rut, Long id);

    @Override
    @EntityGraph(attributePaths = {"areaTrabajo"})
    List<Integrante> findAll();
}
