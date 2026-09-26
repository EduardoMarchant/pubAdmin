package com.pubadmin.service;

import com.pubadmin.dto.GuardarPermisosRequest;
import com.pubadmin.dto.PermisoItem;
import com.pubadmin.entity.PermisoRol;
import com.pubadmin.repository.PermisoRolRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PermisoRolService {

    private final PermisoRolRepository permisoRolRepository;

    public PermisoRolService(PermisoRolRepository permisoRolRepository) {
        this.permisoRolRepository = permisoRolRepository;
    }

    public List<PermisoItem> listarPorRol(String rol) {
        return permisoRolRepository.findByRol(rol).stream()
                .map(p -> new PermisoItem(p.getMenuClave(), p.isHabilitado()))
                .toList();
    }

    @Transactional
    public void guardar(GuardarPermisosRequest request) {
        permisoRolRepository.deleteByRol(request.getRol());
        permisoRolRepository.flush();

        List<PermisoRol> nuevos = request.getPermisos().stream()
                .map(item -> {
                    PermisoRol permiso = new PermisoRol();
                    permiso.setRol(request.getRol());
                    permiso.setMenuClave(item.getMenuClave());
                    permiso.setHabilitado(item.isHabilitado());
                    return permiso;
                })
                .toList();

        permisoRolRepository.saveAll(nuevos);
    }
}
