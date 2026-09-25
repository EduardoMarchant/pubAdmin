package com.pubadmin.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class InventarioGuardarRequest {

    @NotNull
    private Long plantillaId;

    @NotEmpty
    @Valid
    private List<InventarioRegistroRequest> registros;

    public Long getPlantillaId() {
        return plantillaId;
    }

    public void setPlantillaId(Long plantillaId) {
        this.plantillaId = plantillaId;
    }

    public List<InventarioRegistroRequest> getRegistros() {
        return registros;
    }

    public void setRegistros(List<InventarioRegistroRequest> registros) {
        this.registros = registros;
    }
}
