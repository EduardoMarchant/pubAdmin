import { Component, OnInit, inject, signal } from '@angular/core';
import { ESTRUCTURA_MENU, ItemMenuPadre } from '../../../core/menu-estructura';
import { PermisoItem, PermisosRolService } from './permisos-rol.service';

const ROLES = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'USUARIO', label: 'Usuario' },
];

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent implements OnInit {
  private readonly permisosService = inject(PermisosRolService);

  readonly roles = ROLES;
  readonly estructura = ESTRUCTURA_MENU;

  readonly rolSeleccionado = signal(ROLES[0].value);
  readonly estados = signal<Map<string, boolean>>(new Map());

  readonly loading = signal(false);
  readonly guardando = signal(false);
  readonly mensaje = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargar();
  }

  onRolChange(event: Event): void {
    this.rolSeleccionado.set((event.target as HTMLSelectElement).value);
    this.cargar();
  }

  habilitado(clave: string): boolean {
    return this.estados().get(clave) ?? true;
  }

  toggleGrupo(grupo: ItemMenuPadre): void {
    const nuevoValor = !this.habilitado(grupo.clave);
    const mapa = new Map(this.estados());
    mapa.set(grupo.clave, nuevoValor);
    if (!nuevoValor) {
      for (const hijo of grupo.hijos) {
        mapa.set(hijo.clave, false);
      }
    }
    this.estados.set(mapa);
  }

  toggleHijo(grupo: ItemMenuPadre, hijo: { clave: string }): void {
    if (!this.habilitado(grupo.clave)) {
      return;
    }
    const mapa = new Map(this.estados());
    mapa.set(hijo.clave, !this.habilitado(hijo.clave));
    this.estados.set(mapa);
  }

  guardar(): void {
    this.guardando.set(true);
    this.mensaje.set(null);
    this.error.set(null);

    const permisos: PermisoItem[] = [];
    for (const grupo of ESTRUCTURA_MENU) {
      permisos.push({ menuClave: grupo.clave, habilitado: this.habilitado(grupo.clave) });
      for (const hijo of grupo.hijos) {
        permisos.push({ menuClave: hijo.clave, habilitado: this.habilitado(hijo.clave) });
      }
    }

    this.permisosService.guardar(this.rolSeleccionado(), permisos).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mensaje.set('Permisos guardados correctamente.');
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('No se pudo guardar los permisos.');
      },
    });
  }

  private cargar(): void {
    this.loading.set(true);
    this.error.set(null);
    this.mensaje.set(null);

    this.permisosService.listar(this.rolSeleccionado()).subscribe({
      next: (permisos) => {
        const mapa = new Map<string, boolean>();
        for (const grupo of ESTRUCTURA_MENU) {
          mapa.set(grupo.clave, true);
          for (const hijo of grupo.hijos) {
            mapa.set(hijo.clave, true);
          }
        }
        for (const permiso of permisos) {
          mapa.set(permiso.menuClave, permiso.habilitado);
        }
        this.estados.set(mapa);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar los permisos.');
        this.loading.set(false);
      },
    });
  }
}
