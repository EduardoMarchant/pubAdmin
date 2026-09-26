CREATE TABLE permisos_rol (
    id          BIGSERIAL PRIMARY KEY,
    rol         VARCHAR(20)  NOT NULL,
    menu_clave  VARCHAR(100) NOT NULL,
    habilitado  BOOLEAN      NOT NULL DEFAULT TRUE,
    UNIQUE (rol, menu_clave)
);
