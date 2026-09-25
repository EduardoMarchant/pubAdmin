package com.pubadmin.controller;

import com.pubadmin.dto.ImportItemsResult;
import com.pubadmin.dto.ItemRequest;
import com.pubadmin.dto.ItemResponse;
import com.pubadmin.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public List<ItemResponse> listarPorPlantilla(@RequestParam Long plantillaId) {
        return itemService.listarPorPlantilla(plantillaId);
    }

    @PostMapping
    public ResponseEntity<ItemResponse> crear(@Valid @RequestBody ItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(itemService.crear(request));
    }

    @PostMapping(value = "/carga-masiva", consumes = "multipart/form-data")
    public ImportItemsResult cargarMasivo(@RequestParam("file") MultipartFile file) {
        return itemService.cargarDesdeExcel(file);
    }
}
