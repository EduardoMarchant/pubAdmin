package com.pubadmin.dto;

import com.pubadmin.entity.Integrante;

public class IntegranteResponse {

    private final Long id;
    private final String nombre;
    private final String segundoNombre;
    private final String apellidoPaterno;
    private final String apellidoMaterno;
    private final String alias;
    private final String rut;
    private final String telefono;
    private final String email;
    private final String estado;
    private final Long areaTrabajoId;
    private final String areaTrabajoNombre;

    public IntegranteResponse(
            Long id,
            String nombre,
            String segundoNombre,
            String apellidoPaterno,
            String apellidoMaterno,
            String alias,
            String rut,
            String telefono,
            String email,
            String estado,
            Long areaTrabajoId,
            String areaTrabajoNombre) {
        this.id = id;
        this.nombre = nombre;
        this.segundoNombre = segundoNombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.alias = alias;
        this.rut = rut;
        this.telefono = telefono;
        this.email = email;
        this.estado = estado;
        this.areaTrabajoId = areaTrabajoId;
        this.areaTrabajoNombre = areaTrabajoNombre;
    }

    public static IntegranteResponse from(Integrante integrante) {
        return new IntegranteResponse(
                integrante.getId(),
                integrante.getNombre(),
                integrante.getSegundoNombre(),
                integrante.getApellidoPaterno(),
                integrante.getApellidoMaterno(),
                integrante.getAlias(),
                integrante.getRut(),
                integrante.getTelefono(),
                integrante.getEmail(),
                integrante.getEstado(),
                integrante.getAreaTrabajo().getId(),
                integrante.getAreaTrabajo().getNombre());
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getSegundoNombre() {
        return segundoNombre;
    }

    public String getApellidoPaterno() {
        return apellidoPaterno;
    }

    public String getApellidoMaterno() {
        return apellidoMaterno;
    }

    public String getAlias() {
        return alias;
    }

    public String getRut() {
        return rut;
    }

    public String getTelefono() {
        return telefono;
    }

    public String getEmail() {
        return email;
    }

    public String getEstado() {
        return estado;
    }

    public Long getAreaTrabajoId() {
        return areaTrabajoId;
    }

    public String getAreaTrabajoNombre() {
        return areaTrabajoNombre;
    }
}
