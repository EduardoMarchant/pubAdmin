package com.pubadmin.dto;

import jakarta.validation.constraints.NotBlank;

public class NombreCatalogoRequest {

    @NotBlank
    private String nombre;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
