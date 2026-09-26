package com.pubadmin.dto;

public class InventarioItemPreparado {

    private final Long itemId;
    private final String itemNombre;
    private final String itemCategoria;
    private final String itemEstado;
    private final Integer cantidadAnterior;
    private final Integer cantidadActualHoy;

    public InventarioItemPreparado(
            Long itemId,
            String itemNombre,
            String itemCategoria,
            String itemEstado,
            Integer cantidadAnterior,
            Integer cantidadActualHoy) {
        this.itemId = itemId;
        this.itemNombre = itemNombre;
        this.itemCategoria = itemCategoria;
        this.itemEstado = itemEstado;
        this.cantidadAnterior = cantidadAnterior;
        this.cantidadActualHoy = cantidadActualHoy;
    }

    public Long getItemId() {
        return itemId;
    }

    public String getItemNombre() {
        return itemNombre;
    }

    public String getItemCategoria() {
        return itemCategoria;
    }

    public String getItemEstado() {
        return itemEstado;
    }

    public Integer getCantidadAnterior() {
        return cantidadAnterior;
    }

    public Integer getCantidadActualHoy() {
        return cantidadActualHoy;
    }
}
