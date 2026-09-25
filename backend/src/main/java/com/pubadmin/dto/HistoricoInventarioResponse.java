package com.pubadmin.dto;

import java.time.LocalDateTime;

public class HistoricoInventarioResponse {

    private final Long plantillaId;
    private final String plantillaNombre;
    private final String plantillaTipo;
    private final LocalDateTime fecha;
    private final Long usuarioId;
    private final String usuarioNombre;

    public HistoricoInventarioResponse(
            Long plantillaId,
            String plantillaNombre,
            String plantillaTipo,
            LocalDateTime fecha,
            Long usuarioId,
            String usuarioNombre) {
        this.plantillaId = plantillaId;
        this.plantillaNombre = plantillaNombre;
        this.plantillaTipo = plantillaTipo;
        this.fecha = fecha;
        this.usuarioId = usuarioId;
        this.usuarioNombre = usuarioNombre;
    }

    public Long getPlantillaId() {
        return plantillaId;
    }

    public String getPlantillaNombre() {
        return plantillaNombre;
    }

    public String getPlantillaTipo() {
        return plantillaTipo;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public String getUsuarioNombre() {
        return usuarioNombre;
    }
}
