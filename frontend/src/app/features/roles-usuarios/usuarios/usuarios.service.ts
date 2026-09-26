import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  rol: string;
  activo: boolean;
}

export interface UsuarioCreatePayload {
  username: string;
  password: string;
  nombre: string;
  rol: string;
  activo: boolean;
}

export interface UsuarioUpdatePayload {
  username: string;
  nombre: string;
  rol: string;
  activo: boolean;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  crear(payload: UsuarioCreatePayload): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, payload);
  }

  actualizar(id: number, payload: UsuarioUpdatePayload): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, payload);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
