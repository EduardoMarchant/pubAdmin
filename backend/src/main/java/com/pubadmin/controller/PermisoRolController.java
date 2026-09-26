package com.pubadmin.controller;

import com.pubadmin.dto.GuardarPermisosRequest;
import com.pubadmin.dto.PermisoItem;
import com.pubadmin.service.PermisoRolService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/permisos-rol")
public class PermisoRolController {

    private final PermisoRolService permisoRolService;

    public PermisoRolController(PermisoRolService permisoRolService) {
        this.permisoRolService = permisoRolService;
    }

    @GetMapping
    public List<PermisoItem> listar(@RequestParam String rol) {
        return permisoRolService.listarPorRol(rol);
    }

    @PostMapping
    public void guardar(@Valid @RequestBody GuardarPermisosRequest request) {
        permisoRolService.guardar(request);
    }
}
