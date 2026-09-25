package com.pubadmin.service;

import com.pubadmin.dto.IntegranteRequest;
import com.pubadmin.dto.IntegranteResponse;
import com.pubadmin.entity.AreaTrabajo;
import com.pubadmin.entity.Integrante;
import com.pubadmin.repository.AreaTrabajoRepository;
import com.pubadmin.repository.IntegranteRepository;
import com.pubadmin.util.RutChileno;
import com.pubadmin.util.TelefonoChileno;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class IntegranteService {

    private final IntegranteRepository integranteRepository;
    private final AreaTrabajoRepository areaTrabajoRepository;

    public IntegranteService(IntegranteRepository integranteRepository, AreaTrabajoRepository areaTrabajoRepository) {
        this.integranteRepository = integranteRepository;
        this.areaTrabajoRepository = areaTrabajoRepository;
    }

    public List<IntegranteResponse> listar() {
        return integranteRepository.findAll().stream()
                .map(IntegranteResponse::from)
                .toList();
    }

    @Transactional
    public IntegranteResponse crear(IntegranteRequest request) {
        String rutNormalizado = RutChileno.normalizar(request.getRut());
        if (rutNormalizado == null || !RutChileno.esValido(rutNormalizado)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "RUT inválido");
        }

        if (integranteRepository.existsByRut(rutNormalizado)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un integrante con ese RUT");
        }

        if (!TelefonoChileno.esValido(request.getTelefono())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Teléfono inválido, debe ser un número chileno válido");
        }

        AreaTrabajo areaTrabajo = areaTrabajoRepository.findById(request.getAreaTrabajoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Área de trabajo no encontrada"));

        Integrante integrante = new Integrante();
        integrante.setNombre(request.getNombre());
        integrante.setSegundoNombre(request.getSegundoNombre());
        integrante.setApellidoPaterno(request.getApellidoPaterno());
        integrante.setApellidoMaterno(request.getApellidoMaterno());
        integrante.setAlias(request.getAlias());
        integrante.setRut(rutNormalizado);
        integrante.setTelefono(TelefonoChileno.normalizar(request.getTelefono()));
        integrante.setEmail(request.getEmail());
        integrante.setEstado(request.getEstado());
        integrante.setAreaTrabajo(areaTrabajo);

        return IntegranteResponse.from(integranteRepository.save(integrante));
    }

    @Transactional
    public IntegranteResponse actualizar(Long id, IntegranteRequest request) {
        Integrante integrante = integranteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Integrante no encontrado"));

        String rutNormalizado = RutChileno.normalizar(request.getRut());
        if (rutNormalizado == null || !RutChileno.esValido(rutNormalizado)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "RUT inválido");
        }

        if (integranteRepository.existsByRutAndIdNot(rutNormalizado, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un integrante con ese RUT");
        }

        if (!TelefonoChileno.esValido(request.getTelefono())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Teléfono inválido, debe ser un número chileno válido");
        }

        AreaTrabajo areaTrabajo = areaTrabajoRepository.findById(request.getAreaTrabajoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Área de trabajo no encontrada"));

        integrante.setNombre(request.getNombre());
        integrante.setSegundoNombre(request.getSegundoNombre());
        integrante.setApellidoPaterno(request.getApellidoPaterno());
        integrante.setApellidoMaterno(request.getApellidoMaterno());
        integrante.setAlias(request.getAlias());
        integrante.setRut(rutNormalizado);
        integrante.setTelefono(TelefonoChileno.normalizar(request.getTelefono()));
        integrante.setEmail(request.getEmail());
        integrante.setEstado(request.getEstado());
        integrante.setAreaTrabajo(areaTrabajo);

        return IntegranteResponse.from(integranteRepository.save(integrante));
    }
}
