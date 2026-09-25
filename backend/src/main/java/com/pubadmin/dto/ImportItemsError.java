package com.pubadmin.dto;

public class ImportItemsError {

    private final int fila;
    private final String motivo;

    public ImportItemsError(int fila, String motivo) {
        this.fila = fila;
        this.motivo = motivo;
    }

    public int getFila() {
        return fila;
    }

    public String getMotivo() {
        return motivo;
    }
}
