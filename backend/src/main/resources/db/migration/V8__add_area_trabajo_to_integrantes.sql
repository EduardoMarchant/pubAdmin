-- Asegurar que exista el área "Administración" para los integrantes ya cargados
INSERT INTO areas_trabajo (nombre)
SELECT 'Administración'
WHERE NOT EXISTS (SELECT 1 FROM areas_trabajo WHERE nombre = 'Administración');

ALTER TABLE integrantes ADD COLUMN area_trabajo_id BIGINT;

UPDATE integrantes
SET area_trabajo_id = (SELECT id FROM areas_trabajo WHERE nombre = 'Administración' LIMIT 1)
WHERE area_trabajo_id IS NULL;

ALTER TABLE integrantes
    ALTER COLUMN area_trabajo_id SET NOT NULL;

ALTER TABLE integrantes
    ADD CONSTRAINT fk_integrantes_area_trabajo FOREIGN KEY (area_trabajo_id) REFERENCES areas_trabajo(id);
