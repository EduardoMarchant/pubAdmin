package com.pubadmin.controller;

import com.pubadmin.dto.PlantillaRequest;
import com.pubadmin.dto.PlantillaResponse;
import com.pubadmin.service.PlantillaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plantillas")
public class PlantillaController {

    private final PlantillaService plantillaService;

    public PlantillaController(PlantillaService plantillaService) {
        this.plantillaService = plantillaService;
    }

    @GetMapping
    public List<PlantillaResponse> listar() {
        return plantillaService.listar();
    }

    @PostMapping
    public ResponseEntity<PlantillaResponse> crear(@Valid @RequestBody PlantillaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(plantillaService.crear(request));
    }

    @PutMapping("/{id}")
    public PlantillaResponse actualizar(@PathVariable Long id, @Valid @RequestBody PlantillaRequest request) {
        return plantillaService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        plantillaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
