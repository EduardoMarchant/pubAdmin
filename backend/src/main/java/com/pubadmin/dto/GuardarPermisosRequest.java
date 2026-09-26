package com.pubadmin.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class GuardarPermisosRequest {

    @NotBlank
    private String rol;

    @NotEmpty
    @Valid
    private List<PermisoItem> permisos;

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public List<PermisoItem> getPermisos() {
        return permisos;
    }

    public void setPermisos(List<PermisoItem> permisos) {
        this.permisos = permisos;
    }
}
