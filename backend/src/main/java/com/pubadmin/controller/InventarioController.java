package com.pubadmin.controller;

import com.pubadmin.dto.HistoricoInventarioResponse;
import com.pubadmin.dto.InventarioDetalleItem;
import com.pubadmin.dto.InventarioGuardarRequest;
import com.pubadmin.dto.InventarioGuardarResponse;
import com.pubadmin.dto.InventarioItemPreparado;
import com.pubadmin.service.InventarioService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    @GetMapping("/preparar")
    public List<InventarioItemPreparado> preparar(@RequestParam Long plantillaId) {
        return inventarioService.preparar(plantillaId);
    }

    @PostMapping
    public InventarioGuardarResponse guardar(@Valid @RequestBody InventarioGuardarRequest request, Principal principal) {
        return inventarioService.guardar(request, principal.getName());
    }

    @GetMapping("/historico")
    public List<HistoricoInventarioResponse> historico(
            @RequestParam(required = false) Long plantillaId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return inventarioService.buscarHistorico(plantillaId, fecha);
    }

    @GetMapping("/detalle")
    public List<InventarioDetalleItem> detalle(
            @RequestParam Long plantillaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fecha,
            @RequestParam Long usuarioId) {
        return inventarioService.buscarDetalle(plantillaId, fecha, usuarioId);
    }
}
