package com.pubadmin.controller;

import com.pubadmin.dto.IntegranteRequest;
import com.pubadmin.dto.IntegranteResponse;
import com.pubadmin.service.IntegranteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/integrantes")
public class IntegranteController {

    private final IntegranteService integranteService;

    public IntegranteController(IntegranteService integranteService) {
        this.integranteService = integranteService;
    }

    @GetMapping
    public List<IntegranteResponse> listar() {
        return integranteService.listar();
    }

    @PostMapping
    public ResponseEntity<IntegranteResponse> crear(@Valid @RequestBody IntegranteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(integranteService.crear(request));
    }

    @PutMapping("/{id}")
    public IntegranteResponse actualizar(@PathVariable Long id, @Valid @RequestBody IntegranteRequest request) {
        return integranteService.actualizar(id, request);
    }
}
