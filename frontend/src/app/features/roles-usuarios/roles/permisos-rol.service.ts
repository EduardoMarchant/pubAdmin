import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PermisoItem {
  menuClave: string;
  habilitado: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PermisosRolService {
  private readonly baseUrl = `${environment.apiUrl}/permisos-rol`;

  constructor(private readonly http: HttpClient) {}

  listar(rol: string): Observable<PermisoItem[]> {
    const params = new HttpParams().set('rol', rol);
    return this.http.get<PermisoItem[]>(this.baseUrl, { params });
  }

  guardar(rol: string, permisos: PermisoItem[]): Observable<void> {
    return this.http.post<void>(this.baseUrl, { rol, permisos });
  }
}
