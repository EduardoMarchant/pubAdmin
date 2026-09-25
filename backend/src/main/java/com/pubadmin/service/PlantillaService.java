package com.pubadmin.service;

import com.pubadmin.dto.PlantillaRequest;
import com.pubadmin.dto.PlantillaResponse;
import com.pubadmin.entity.Plantilla;
import com.pubadmin.repository.PlantillaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PlantillaService {

    private final PlantillaRepository plantillaRepository;

    public PlantillaService(PlantillaRepository plantillaRepository) {
        this.plantillaRepository = plantillaRepository;
    }

    public List<PlantillaResponse> listar() {
        return plantillaRepository.findAll().stream()
                .map(PlantillaResponse::from)
                .toList();
    }

    public PlantillaResponse crear(PlantillaRequest request) {
        Plantilla plantilla = new Plantilla();
        plantilla.setNombre(request.getNombre());
        plantilla.setTipo(request.getTipo());
        plantilla.setFechaCreacion(request.getFechaCreacion());

        return PlantillaResponse.from(plantillaRepository.save(plantilla));
    }

    public PlantillaResponse actualizar(Long id, PlantillaRequest request) {
        Plantilla plantilla = plantillaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Planilla no encontrada"));

        plantilla.setNombre(request.getNombre());
        plantilla.setTipo(request.getTipo());
        plantilla.setFechaCreacion(request.getFechaCreacion());

        return PlantillaResponse.from(plantillaRepository.save(plantilla));
    }

    public void eliminar(Long id) {
        if (!plantillaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Planilla no encontrada");
        }
        plantillaRepository.deleteById(id);
    }
}
