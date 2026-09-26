export interface ItemMenuHijo {
  clave: string;
  etiqueta: string;
  path: string;
}

export interface ItemMenuPadre {
  clave: string;
  etiqueta: string;
  icon?: 'box' | 'calendar' | 'people' | 'shield';
  hijos: ItemMenuHijo[];
}

export const ESTRUCTURA_MENU: ItemMenuPadre[] = [
  {
    clave: 'roles-usuarios',
    etiqueta: 'Roles/Usuarios',
    icon: 'shield',
    hijos: [
      { clave: 'roles-usuarios/usuarios', etiqueta: 'Usuarios', path: '/roles-usuarios/usuarios' },
      { clave: 'roles-usuarios/roles', etiqueta: 'Roles', path: '/roles-usuarios/roles' },
    ],
  },
  {
    clave: 'inventario',
    etiqueta: 'Inventario',
    icon: 'box',
    hijos: [
      { clave: 'inventario/nuevo', etiqueta: 'Nuevo inventario', path: '/inventario/nuevo' },
      { clave: 'inventario/historico', etiqueta: 'Histórico', path: '/inventario/historico' },
      { clave: 'inventario/plantillas', etiqueta: 'Plantillas', path: '/inventario/plantillas' },
    ],
  },
  {
    clave: 'eventos',
    etiqueta: 'Eventos',
    icon: 'calendar',
    hijos: [
      { clave: 'eventos/ingreso', etiqueta: 'Ingreso de eventos', path: '/eventos/ingreso' },
      { clave: 'eventos/evaluacion', etiqueta: 'Evaluación', path: '/eventos/evaluacion' },
      { clave: 'eventos/configuracion', etiqueta: 'Configuración', path: '/eventos/configuracion' },
    ],
  },
  {
    clave: 'recursos-humanos',
    etiqueta: 'Recursos Humanos',
    icon: 'people',
    hijos: [
      { clave: 'recursos-humanos/contratos', etiqueta: 'Contratos', path: '/recursos-humanos/contratos' },
      { clave: 'recursos-humanos/asistencia', etiqueta: 'Asistencia', path: '/recursos-humanos/asistencia' },
      { clave: 'recursos-humanos/permisos', etiqueta: 'Permisos', path: '/recursos-humanos/permisos' },
      { clave: 'recursos-humanos/horarios', etiqueta: 'Horarios', path: '/recursos-humanos/horarios' },
      { clave: 'recursos-humanos/equipo', etiqueta: 'Configuración equipo', path: '/recursos-humanos/equipo' },
    ],
  },
];

export function clavePorPath(path: string): string | null {
  for (const padre of ESTRUCTURA_MENU) {
    for (const hijo of padre.hijos) {
      if (hijo.path === path) {
        return hijo.clave;
      }
    }
  }
  return null;
}
