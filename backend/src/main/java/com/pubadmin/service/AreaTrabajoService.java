package com.pubadmin.service;

import com.pubadmin.dto.NombreCatalogoRequest;
import com.pubadmin.dto.NombreCatalogoResponse;
import com.pubadmin.entity.AreaTrabajo;
import com.pubadmin.repository.AreaTrabajoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AreaTrabajoService {

    private final AreaTrabajoRepository areaTrabajoRepository;

    public AreaTrabajoService(AreaTrabajoRepository areaTrabajoRepository) {
        this.areaTrabajoRepository = areaTrabajoRepository;
    }

    public List<NombreCatalogoResponse> listar() {
        return areaTrabajoRepository.findAll().stream()
                .map(a -> new NombreCatalogoResponse(a.getId(), a.getNombre()))
                .toList();
    }

    public NombreCatalogoResponse crear(NombreCatalogoRequest request) {
        AreaTrabajo area = new AreaTrabajo();
        area.setNombre(request.getNombre());
        AreaTrabajo guardada = areaTrabajoRepository.save(area);
        return new NombreCatalogoResponse(guardada.getId(), guardada.getNombre());
    }
}
