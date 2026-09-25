package com.pubadmin.dto;

import com.pubadmin.entity.Item;

public class ItemResponse {

    private final Long id;
    private final String nombre;
    private final String categoria;
    private final String estado;
    private final Long plantillaId;
    private final String plantillaNombre;

    public ItemResponse(
            Long id,
            String nombre,
            String categoria,
            String estado,
            Long plantillaId,
            String plantillaNombre) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.estado = estado;
        this.plantillaId = plantillaId;
        this.plantillaNombre = plantillaNombre;
    }

    public static ItemResponse from(Item item) {
        return new ItemResponse(
                item.getId(),
                item.getNombre(),
                item.getCategoria(),
                item.getEstado(),
                item.getPlantilla().getId(),
                item.getPlantilla().getNombre());
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getCategoria() {
        return categoria;
    }

    public String getEstado() {
        return estado;
    }

    public Long getPlantillaId() {
        return plantillaId;
    }

    public String getPlantillaNombre() {
        return plantillaNombre;
    }
}
