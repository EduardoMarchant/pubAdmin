package com.pubadmin.repository;

import com.pubadmin.entity.PermisoRol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PermisoRolRepository extends JpaRepository<PermisoRol, Long> {

    List<PermisoRol> findByRol(String rol);

    void deleteByRol(String rol);
}
