CREATE TABLE items (
    id                  BIGSERIAL PRIMARY KEY,
    nombre              VARCHAR(100) NOT NULL,
    categoria           VARCHAR(50)  NOT NULL,
    cantidad_anterior   INTEGER      NOT NULL DEFAULT 0,
    cantidad_actual     INTEGER      NOT NULL DEFAULT 0,
    plantilla_id        BIGINT       NOT NULL REFERENCES plantillas(id) ON DELETE CASCADE
);

CREATE INDEX idx_items_plantilla_id ON items(plantilla_id);
