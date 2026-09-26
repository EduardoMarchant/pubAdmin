import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface PermisoItem {
  menuClave: string;
  habilitado: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PermisosService {
  private readonly http = inject(HttpClient);
  private readonly mapaPermisos = signal<Map<string, boolean> | null>(null);
  private rolCargado: string | null = null;

  cargar(rol: string): Observable<void> {
    if (this.rolCargado === rol && this.mapaPermisos()) {
      return of(void 0);
    }

    const params = new HttpParams().set('rol', rol);
    return this.http.get<PermisoItem[]>(`${environment.apiUrl}/permisos-rol`, { params }).pipe(
      map((items) => {
        const mapa = new Map<string, boolean>();
        items.forEach((item) => mapa.set(item.menuClave, item.habilitado));
        return mapa;
      }),
      tap((mapa) => {
        this.mapaPermisos.set(mapa);
        this.rolCargado = rol;
      }),
      map(() => void 0),
    );
  }

  invalidar(): void {
    this.mapaPermisos.set(null);
    this.rolCargado = null;
  }

  estaHabilitado(clave: string, rol: string | undefined | null): boolean {
    if (rol === 'ADMIN') {
      return true;
    }

    const mapa = this.mapaPermisos();
    if (!mapa) {
      return true;
    }

    const propio = mapa.get(clave) ?? true;
    if (!propio) {
      return false;
    }

    if (clave.includes('/')) {
      const padre = clave.split('/')[0];
      if ((mapa.get(padre) ?? true) === false) {
        return false;
      }
    }

    return true;
  }
}
