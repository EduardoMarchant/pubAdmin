package com.pubadmin.dto;

public class NombreCatalogoResponse {

    private final Long id;
    private final String nombre;

    public NombreCatalogoResponse(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }
}
