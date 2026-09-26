CREATE TABLE integrantes (
    id                  BIGSERIAL PRIMARY KEY,
    nombre              VARCHAR(50)  NOT NULL,
    segundo_nombre      VARCHAR(50),
    apellido_paterno    VARCHAR(50)  NOT NULL,
    apellido_materno    VARCHAR(50),
    alias               VARCHAR(50),
    rut                 VARCHAR(12)  NOT NULL UNIQUE,
    telefono            VARCHAR(20)  NOT NULL,
    email               VARCHAR(100) NOT NULL,
    estado              VARCHAR(20)  NOT NULL DEFAULT 'Activo'
);
