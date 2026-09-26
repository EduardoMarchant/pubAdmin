import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Integrante {
  id: number;
  nombre: string;
  segundoNombre: string | null;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  alias: string | null;
  rut: string;
  telefono: string;
  email: string;
  estado: string;
  areaTrabajoId: number;
  areaTrabajoNombre: string;
}

export interface IntegrantePayload {
  nombre: string;
  segundoNombre: string | null;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  alias: string | null;
  rut: string;
  telefono: string;
  email: string;
  estado: string;
  areaTrabajoId: number;
}

@Injectable({
  providedIn: 'root',
})
export class EquipoService {
  private readonly baseUrl = `${environment.apiUrl}/integrantes`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Integrante[]> {
    return this.http.get<Integrante[]>(this.baseUrl);
  }

  crear(payload: IntegrantePayload): Observable<Integrante> {
    return this.http.post<Integrante>(this.baseUrl, payload);
  }

  actualizar(id: number, payload: IntegrantePayload): Observable<Integrante> {
    return this.http.put<Integrante>(`${this.baseUrl}/${id}`, payload);
  }
}
