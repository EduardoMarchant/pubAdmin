package com.pubadmin.dto;

import jakarta.validation.constraints.NotBlank;

public class UsuarioUpdateRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String nombre;

    @NotBlank
    private String rol;

    private boolean activo;

    /** Opcional: si viene vacía o nula, la contraseña actual no se modifica. */
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
