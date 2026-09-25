package com.pubadmin.service;

import com.pubadmin.dto.ImportItemsError;
import com.pubadmin.dto.ImportItemsResult;
import com.pubadmin.dto.ItemRequest;
import com.pubadmin.dto.ItemResponse;
import com.pubadmin.entity.Item;
import com.pubadmin.entity.Plantilla;
import com.pubadmin.repository.ItemRepository;
import com.pubadmin.repository.PlantillaRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ItemService {

    private static final DataFormatter DATA_FORMATTER = new DataFormatter();

    private final ItemRepository itemRepository;
    private final PlantillaRepository plantillaRepository;

    public ItemService(ItemRepository itemRepository, PlantillaRepository plantillaRepository) {
        this.itemRepository = itemRepository;
        this.plantillaRepository = plantillaRepository;
    }

    public List<ItemResponse> listarPorPlantilla(Long plantillaId) {
        if (!plantillaRepository.existsById(plantillaId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Planilla no encontrada");
        }
        return itemRepository.findByPlantillaId(plantillaId).stream()
                .map(ItemResponse::from)
                .toList();
    }

    public ItemResponse crear(ItemRequest request) {
        Plantilla plantilla = plantillaRepository.findById(request.getPlantillaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Planilla no encontrada"));

        Item item = new Item();
        item.setNombre(request.getNombre());
        item.setCategoria(request.getCategoria());
        item.setEstado(request.getEstado());
        item.setPlantilla(plantilla);

        return ItemResponse.from(itemRepository.save(item));
    }

    public ImportItemsResult cargarDesdeExcel(MultipartFile file) {
        List<ImportItemsError> errores = new ArrayList<>();
        List<Item> nuevosItems = new ArrayList<>();

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El archivo no tiene encabezados");
            }

            Map<String, Integer> columnas = new HashMap<>();
            for (Cell cell : headerRow) {
                String encabezado = DATA_FORMATTER.formatCellValue(cell).trim().toLowerCase();
                columnas.put(encabezado, cell.getColumnIndex());
            }

            Integer colNombre = columnas.get("nombre");
            Integer colCategoria = columnas.get("categoria");
            Integer colEstado = columnas.get("estado");
            Integer colPlantilla = columnas.get("plantilla");

            if (colNombre == null || colCategoria == null || colEstado == null || colPlantilla == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El archivo debe tener las columnas: Nombre, Categoria, Estado, Plantilla");
            }

            int ultimaFila = sheet.getLastRowNum();
            for (int i = 1; i <= ultimaFila; i++) {
                Row row = sheet.getRow(i);
                if (row == null || esFilaVacia(row)) {
                    continue;
                }

                int filaExcel = i + 1;

                String nombre = valorCelda(row, colNombre);
                String categoria = valorCelda(row, colCategoria);
                String estado = valorCelda(row, colEstado);
                String plantillaNombre = valorCelda(row, colPlantilla);

                if (nombre.isBlank() || categoria.isBlank() || estado.isBlank() || plantillaNombre.isBlank()) {
                    errores.add(new ImportItemsError(filaExcel, "Todos los campos son obligatorios"));
                    continue;
                }

                String estadoNormalizado = normalizarEstado(estado);
                if (estadoNormalizado == null) {
                    errores.add(new ImportItemsError(
                            filaExcel, "Estado inválido: '" + estado + "' (debe ser Activo o Inactivo)"));
                    continue;
                }

                Optional<Plantilla> plantilla = plantillaRepository.findFirstByNombreIgnoreCase(plantillaNombre);
                if (plantilla.isEmpty()) {
                    errores.add(new ImportItemsError(filaExcel, "Planilla '" + plantillaNombre + "' no encontrada"));
                    continue;
                }

                Item item = new Item();
                item.setNombre(nombre);
                item.setCategoria(categoria);
                item.setEstado(estadoNormalizado);
                item.setPlantilla(plantilla.get());
                nuevosItems.add(item);
            }
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se pudo leer el archivo Excel");
        }

        itemRepository.saveAll(nuevosItems);

        return new ImportItemsResult(nuevosItems.size(), errores);
    }

    private static String valorCelda(Row row, int colIndex) {
        Cell cell = row.getCell(colIndex);
        return cell == null ? "" : DATA_FORMATTER.formatCellValue(cell).trim();
    }

    private static boolean esFilaVacia(Row row) {
        for (Cell cell : row) {
            if (cell.getCellType() != CellType.BLANK && !DATA_FORMATTER.formatCellValue(cell).isBlank()) {
                return false;
            }
        }
        return true;
    }

    private static String normalizarEstado(String valor) {
        if (valor.equalsIgnoreCase("Activo")) {
            return "Activo";
        }
        if (valor.equalsIgnoreCase("Inactivo")) {
            return "Inactivo";
        }
        return null;
    }
}
