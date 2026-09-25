package com.pubadmin.service;

import com.pubadmin.dto.NombreCatalogoRequest;
import com.pubadmin.dto.NombreCatalogoResponse;
import com.pubadmin.entity.Horario;
import com.pubadmin.repository.HorarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HorarioService {

    private final HorarioRepository horarioRepository;

    public HorarioService(HorarioRepository horarioRepository) {
        this.horarioRepository = horarioRepository;
    }

    public List<NombreCatalogoResponse> listar() {
        return horarioRepository.findAll().stream()
                .map(h -> new NombreCatalogoResponse(h.getId(), h.getNombre()))
                .toList();
    }

    public NombreCatalogoResponse crear(NombreCatalogoRequest request) {
        Horario horario = new Horario();
        horario.setNombre(request.getNombre());
        Horario guardado = horarioRepository.save(horario);
        return new NombreCatalogoResponse(guardado.getId(), guardado.getNombre());
    }
}
