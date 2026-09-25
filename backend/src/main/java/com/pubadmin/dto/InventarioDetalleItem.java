package com.pubadmin.dto;

public class InventarioDetalleItem {

    private final String itemNombre;
    private final String itemCategoria;
    private final Integer cantidadAnterior;
    private final Integer cantidadActual;

    public InventarioDetalleItem(
            String itemNombre, String itemCategoria, Integer cantidadAnterior, Integer cantidadActual) {
        this.itemNombre = itemNombre;
        this.itemCategoria = itemCategoria;
        this.cantidadAnterior = cantidadAnterior;
        this.cantidadActual = cantidadActual;
    }

    public String getItemNombre() {
        return itemNombre;
    }

    public String getItemCategoria() {
        return itemCategoria;
    }

    public Integer getCantidadAnterior() {
        return cantidadAnterior;
    }

    public Integer getCantidadActual() {
        return cantidadActual;
    }
}
