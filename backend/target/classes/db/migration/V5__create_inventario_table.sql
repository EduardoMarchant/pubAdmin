CREATE TABLE inventario (
    id                  BIGSERIAL PRIMARY KEY,
    plantilla_id        BIGINT      NOT NULL REFERENCES plantillas(id) ON DELETE CASCADE,
    item_id             BIGINT      NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    cantidad_anterior   INTEGER     NOT NULL DEFAULT 0,
    cantidad_actual     INTEGER     NOT NULL DEFAULT 0,
    usuario_id          BIGINT      NOT NULL REFERENCES usuarios(id),
    fecha               TIMESTAMP   NOT NULL DEFAULT now()
);

CREATE INDEX idx_inventario_plantilla_id ON inventario(plantilla_id);
CREATE INDEX idx_inventario_item_id ON inventario(item_id);
