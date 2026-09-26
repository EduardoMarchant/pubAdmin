package com.pubadmin.repository;

import com.pubadmin.entity.Plantilla;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlantillaRepository extends JpaRepository<Plantilla, Long> {

    Optional<Plantilla> findFirstByNombreIgnoreCase(String nombre);
}
