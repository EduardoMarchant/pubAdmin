package com.pubadmin.service;

import com.pubadmin.dto.HistoricoInventarioResponse;
import com.pubadmin.dto.InventarioDetalleItem;
import com.pubadmin.dto.InventarioGuardarRequest;
import com.pubadmin.dto.InventarioGuardarResponse;
import com.pubadmin.dto.InventarioItemPreparado;
import com.pubadmin.dto.InventarioRegistroRequest;
import com.pubadmin.entity.Inventario;
import com.pubadmin.entity.Item;
import com.pubadmin.entity.Plantilla;
import com.pubadmin.entity.Usuario;
import com.pubadmin.repository.InventarioRepository;
import com.pubadmin.repository.ItemRepository;
import com.pubadmin.repository.PlantillaRepository;
import com.pubadmin.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class InventarioService {

    private final InventarioRepository inventarioRepository;
    private final ItemRepository itemRepository;
    private final PlantillaRepository plantillaRepository;
    private final UsuarioRepository usuarioRepository;

    public InventarioService(
            InventarioRepository inventarioRepository,
            ItemRepository itemRepository,
            PlantillaRepository plantillaRepository,
            UsuarioRepository usuarioRepository) {
        this.inventarioRepository = inventarioRepository;
        this.itemRepository = itemRepository;
        this.plantillaRepository = plantillaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<InventarioItemPreparado> preparar(Long plantillaId) {
        if (!plantillaRepository.existsById(plantillaId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Planilla no encontrada");
        }

        List<Item> items = itemRepository.findByPlantillaId(plantillaId);
        List<Long> itemIds = items.stream().map(Item::getId).toList();

        LocalDateTime inicioDeHoy = LocalDate.now().atStartOfDay();

        Map<Long, Integer> anteriorPorItem = new HashMap<>();
        Map<Long, Integer> hoyPorItem = new HashMap<>();

        for (Inventario registro : inventarioRepository.findByItemIdInOrderByFechaDescIdDesc(itemIds)) {
            Long itemId = registro.getItem().getId();
            if (registro.getFecha().isBefore(inicioDeHoy)) {
                anteriorPorItem.putIfAbsent(itemId, registro.getCantidadActual());
            } else {
                hoyPorItem.putIfAbsent(itemId, registro.getCantidadActual());
            }
        }

        return items.stream()
                .map(item -> new InventarioItemPreparado(
                        item.getId(),
                        item.getNombre(),
                        item.getCategoria(),
                        item.getEstado(),
                        anteriorPorItem.getOrDefault(item.getId(), 0),
                        hoyPorItem.getOrDefault(item.getId(), 0)))
                .toList();
    }

    @Transactional
    public InventarioGuardarResponse guardar(InventarioGuardarRequest request, String username) {
        Plantilla plantilla = plantillaRepository.findById(request.getPlantillaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Planilla no encontrada"));

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime inicioDeHoy = ahora.toLocalDate().atStartOfDay();
        List<Inventario> registros = new ArrayList<>();

        for (InventarioRegistroRequest registroRequest : request.getRegistros()) {
            Item item = itemRepository.findById(registroRequest.getItemId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Ítem no encontrado: " + registroRequest.getItemId()));

            int cantidadAnterior = inventarioRepository
                    .findFirstByItemIdAndFechaBeforeOrderByFechaDescIdDesc(item.getId(), inicioDeHoy)
                    .map(Inventario::getCantidadActual)
                    .orElse(0);

            Inventario registro = new Inventario();
            registro.setPlantilla(plantilla);
            registro.setItem(item);
            registro.setCantidadAnterior(cantidadAnterior);
            registro.setCantidadActual(registroRequest.getCantidadActual());
            registro.setUsuario(usuario);
            registro.setFecha(ahora);
            registros.add(registro);
        }

        inventarioRepository.saveAll(registros);

        return new InventarioGuardarResponse(registros.size());
    }

    public List<HistoricoInventarioResponse> buscarHistorico(Long plantillaId, LocalDate fecha) {
        List<Inventario> registros;

        if (plantillaId != null && fecha != null) {
            LocalDateTime desde = fecha.atStartOfDay();
            LocalDateTime hasta = fecha.plusDays(1).atStartOfDay();
            registros = inventarioRepository.findByPlantillaIdAndFechaBetweenOrderByFechaDesc(
                    plantillaId, desde, hasta);
        } else if (plantillaId != null) {
            registros = inventarioRepository.findByPlantillaIdOrderByFechaDesc(plantillaId);
        } else if (fecha != null) {
            LocalDateTime desde = fecha.atStartOfDay();
            LocalDateTime hasta = fecha.plusDays(1).atStartOfDay();
            registros = inventarioRepository.findByFechaBetweenOrderByFechaDesc(desde, hasta);
        } else {
            registros = inventarioRepository.findAllByOrderByFechaDesc();
        }

        Map<String, HistoricoInventarioResponse> sesionesUnicas = new LinkedHashMap<>();
        for (Inventario registro : registros) {
            String clave = registro.getPlantilla().getId() + "|" + registro.getFecha() + "|"
                    + registro.getUsuario().getId();
            sesionesUnicas.putIfAbsent(
                    clave,
                    new HistoricoInventarioResponse(
                            registro.getPlantilla().getId(),
                            registro.getPlantilla().getNombre(),
                            registro.getPlantilla().getTipo(),
                            registro.getFecha(),
                            registro.getUsuario().getId(),
                            registro.getUsuario().getNombre()));
        }

        return new ArrayList<>(sesionesUnicas.values());
    }

    public List<InventarioDetalleItem> buscarDetalle(Long plantillaId, LocalDateTime fecha, Long usuarioId) {
        return inventarioRepository.findByPlantillaIdAndFechaAndUsuarioId(plantillaId, fecha, usuarioId).stream()
                .sorted(Comparator.comparing(registro -> registro.getItem().getNombre()))
                .map(registro -> new InventarioDetalleItem(
                        registro.getItem().getNombre(),
                        registro.getItem().getCategoria(),
                        registro.getCantidadAnterior(),
                        registro.getCantidadActual()))
                .toList();
    }
}
