package com.pubadmin.repository;

import com.pubadmin.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    @Query("SELECT i FROM Item i JOIN FETCH i.plantilla WHERE i.plantilla.id = :plantillaId")
    List<Item> findByPlantillaId(@Param("plantillaId") Long plantillaId);
}
