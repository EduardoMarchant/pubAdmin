package com.pubadmin.repository;

import com.pubadmin.entity.Inventario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {

    List<Inventario> findByItemIdInOrderByFechaDescIdDesc(List<Long> itemIds);

    Optional<Inventario> findFirstByItemIdAndFechaBeforeOrderByFechaDescIdDesc(Long itemId, LocalDateTime fecha);

    @EntityGraph(attributePaths = {"plantilla", "usuario"})
    List<Inventario> findAllByOrderByFechaDesc();

    @EntityGraph(attributePaths = {"plantilla", "usuario"})
    List<Inventario> findByPlantillaIdOrderByFechaDesc(Long plantillaId);

    @EntityGraph(attributePaths = {"plantilla", "usuario"})
    List<Inventario> findByFechaBetweenOrderByFechaDesc(LocalDateTime desde, LocalDateTime hasta);

    @EntityGraph(attributePaths = {"plantilla", "usuario"})
    List<Inventario> findByPlantillaIdAndFechaBetweenOrderByFechaDesc(
            Long plantillaId, LocalDateTime desde, LocalDateTime hasta);

    @EntityGraph(attributePaths = {"item"})
    List<Inventario> findByPlantillaIdAndFechaAndUsuarioId(Long plantillaId, LocalDateTime fecha, Long usuarioId);
}
