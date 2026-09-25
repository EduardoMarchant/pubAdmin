package com.pubadmin.controller;

import com.pubadmin.dto.NombreCatalogoRequest;
import com.pubadmin.dto.NombreCatalogoResponse;
import com.pubadmin.service.HorarioService;
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
@RequestMapping("/api/horarios")
public class HorarioController {

    private final HorarioService horarioService;

    public HorarioController(HorarioService horarioService) {
        this.horarioService = horarioService;
    }

    @GetMapping
    public List<NombreCatalogoResponse> listar() {
        return horarioService.listar();
    }

    @PostMapping
    public ResponseEntity<NombreCatalogoResponse> crear(@Valid @RequestBody NombreCatalogoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(horarioService.crear(request));
    }
}
