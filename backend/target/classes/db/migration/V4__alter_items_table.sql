ALTER TABLE items
    DROP COLUMN cantidad_anterior,
    DROP COLUMN cantidad_actual,
    ADD COLUMN estado VARCHAR(20) NOT NULL DEFAULT 'Activo';
