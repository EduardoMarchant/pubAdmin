CREATE TABLE plantillas (
    id              BIGSERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    tipo            VARCHAR(20)  NOT NULL,
    fecha_creacion  DATE         NOT NULL
);
