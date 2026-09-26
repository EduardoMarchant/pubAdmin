package com.pubadmin.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "permisos_rol", uniqueConstraints = @UniqueConstraint(columnNames = {"rol", "menu_clave"}))
public class PermisoRol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String rol;

    @Column(name = "menu_clave", nullable = false, length = 100)
    private String menuClave;

    @Column(nullable = false)
    private boolean habilitado;

    public PermisoRol() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
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
