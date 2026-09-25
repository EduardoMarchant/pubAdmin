package com.pubadmin.dto;

public class InventarioGuardarResponse {

    private final int guardados;

    public InventarioGuardarResponse(int guardados) {
        this.guardados = guardados;
    }

    public int getGuardados() {
        return guardados;
    }
}
