package com.pubadmin.controller;

import com.pubadmin.dto.NombreCatalogoRequest;
import com.pubadmin.dto.NombreCatalogoResponse;
import com.pubadmin.service.AreaTrabajoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/areas-trabajo")
public class AreaTrabajoController {

    private final AreaTrabajoService areaTrabajoService;

    public AreaTrabajoController(AreaTrabajoService areaTrabajoService) {
        this.areaTrabajoService = areaTrabajoService;
    }

    @GetMapping
    public List<NombreCatalogoResponse> listar() {
        return areaTrabajoService.listar();
    }

    @PostMapping
    public ResponseEntity<NombreCatalogoResponse> crear(@Valid @RequestBody NombreCatalogoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(areaTrabajoService.crear(request));
    }
}
