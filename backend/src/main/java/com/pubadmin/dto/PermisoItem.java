package com.pubadmin.dto;

import jakarta.validation.constraints.NotBlank;

public class PermisoItem {

    @NotBlank
    private String menuClave;

    private boolean habilitado;

    public PermisoItem() {
    }

    public PermisoItem(String menuClave, boolean habilitado) {
        this.menuClave = menuClave;
        this.habilitado = habilitado;
    }

    public String getMenuClave() {
        return menuClave;
    }

    public void setMenuClave(String menuClave) {
        this.menuClave = menuClave;
    }

    public boolean isHabilitado() {
        return habilitado;
    }

    public void setHabilitado(boolean habilitado) {
        this.habilitado = habilitado;
    }
}
