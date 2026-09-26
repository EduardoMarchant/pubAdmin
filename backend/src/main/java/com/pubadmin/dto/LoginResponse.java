package com.pubadmin.dto;

public class LoginResponse {

    private final String token;
    private final String username;
    private final String nombre;
    private final String rol;

    public LoginResponse(String token, String username, String nombre, String rol) {
        this.token = token;
        this.username = username;
        this.nombre = nombre;
        this.rol = rol;
    }

    public String getToken() {
        return token;
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
}
