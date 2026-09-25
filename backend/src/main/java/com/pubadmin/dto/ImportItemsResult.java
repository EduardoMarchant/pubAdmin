package com.pubadmin.dto;

import java.util.List;

public class ImportItemsResult {

    private final int insertados;
    private final List<ImportItemsError> errores;

    public ImportItemsResult(int insertados, List<ImportItemsError> errores) {
        this.insertados = insertados;
        this.errores = errores;
    }

    public int getInsertados() {
        return insertados;
    }

    public List<ImportItemsError> getErrores() {
        return errores;
    }
}
