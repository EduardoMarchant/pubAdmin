package com.pubadmin.dto;

import com.pubadmin.entity.Plantilla;

import java.time.LocalDate;

public class PlantillaResponse {

    private final Long id;
    private final String nombre;
    private final String tipo;
    private final LocalDate fechaCreacion;

    public PlantillaResponse(Long id, String nombre, String tipo, LocalDate fechaCreacion) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.fechaCreacion = fechaCreacion;
    }

    public static PlantillaResponse from(Plantilla plantilla) {
        return new PlantillaResponse(
                plantilla.getId(), plantilla.getNombre(), plantilla.getTipo(), plantilla.getFechaCreacion());
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public LocalDate getFechaCreacion() {
        return fechaCreacion;
    }
}
