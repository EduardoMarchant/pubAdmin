package com.pubadmin.dto;

import com.pubadmin.entity.Usuario;

public class UsuarioResponse {

    private final Long id;
    private final String username;
    private final String nombre;
    private final String rol;
    private final boolean activo;

    public UsuarioResponse(Long id, String username, String nombre, String rol, boolean activo) {
        this.id = id;
        this.username = username;
        this.nombre = nombre;
        this.rol = rol;
        this.activo = activo;
    }

    public static UsuarioResponse from(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(), usuario.getUsername(), usuario.getNombre(), usuario.getRol(), usuario.isActivo());
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getNombre() {
        return nombre;
    }

    public String getRol() {
        return rol;
    }

    public boolean isActivo() {
        return activo;
    }
}
